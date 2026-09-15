package com.dropick.api.service;

import com.dropick.api.domain.product.Product;
import com.dropick.api.domain.product.ProductRepository;
import com.dropick.api.dto.product.ProductRequest;
import com.dropick.api.dto.product.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional
    public ProductResponse createProduct(ProductRequest.Create request, Long sellerId) {
        Product product = Product.builder()
                .title(request.getTitle())
                .category(request.getCategory())
                .venue(request.getVenue())
                .seat(request.getSeat())
                .eventDate(request.getEventDate())
                .startPrice(request.getStartPrice())
                .minPrice(request.getMinPrice())
                .dropInterval(request.getDropInterval())
                .dropAmount(request.getDropAmount())
                .imageUrl(request.getImageUrl())
                .sellerId(sellerId)
                .status(Product.ProductStatus.ACTIVE) // 바로 진행으로 가정
                .build();
        
        Product saved = productRepository.save(product);
        return new ProductResponse(saved, calculateCurrentPrice(saved));
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(p -> new ProductResponse(p, calculateCurrentPrice(p)))
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));
        return new ProductResponse(product, calculateCurrentPrice(product));
    }

    // 더치옥션 실시간 가격 계산 로직 (서버 사이드)
    private int calculateCurrentPrice(Product product) {
        if (product.getStatus() == Product.ProductStatus.SOLD) {
            return product.getMinPrice(); // 또는 낙찰가 반환
        }
        
        long secondsElapsed = Duration.between(product.getCreatedAt(), LocalDateTime.now()).getSeconds();
        if (secondsElapsed < 0) return product.getStartPrice();
        
        long dropCount = secondsElapsed / product.getDropInterval();
        int priceDrop = (int) (dropCount * product.getDropAmount());
        int currentPrice = product.getStartPrice() - priceDrop;
        
        return Math.max(currentPrice, product.getMinPrice());
    }
}
