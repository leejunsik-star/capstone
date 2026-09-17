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

    private LocalDateTime parseDate(String dateStr, LocalDateTime fallback) {
        if (dateStr == null || dateStr.isBlank()) return fallback;
        try {
            if (dateStr.endsWith("Z")) {
                return java.time.Instant.parse(dateStr).atZone(java.time.ZoneId.of("Asia/Seoul")).toLocalDateTime();
            }
            if (dateStr.length() == 16) {
                return LocalDateTime.parse(dateStr + ":00");
            }
            return LocalDateTime.parse(dateStr.substring(0, Math.min(dateStr.length(), 19)));
        } catch (Exception e) {
            return fallback;
        }
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest.Create request, Long sellerId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime eventDate = parseDate(request.getEventDate(), now.plusDays(7));
        LocalDateTime auctionStartTime = parseDate(request.getAuctionStartTime(), now);
        LocalDateTime auctionEndTime = parseDate(request.getAuctionEndTime(), now.plusDays(2));

        Long actualSellerId = sellerId != null ? sellerId : (request.getSellerId() != null ? request.getSellerId() : 1L);

        Product product = Product.builder()
                .title(request.getTitle())
                .category(request.getCategory() != null ? request.getCategory() : "CONCERT")
                .venue(request.getVenue() != null ? request.getVenue() : "미정")
                .seat(request.getSeat() != null ? request.getSeat() : "자유석")
                .seatGrade(request.getSeatGrade())
                .eventDate(eventDate)
                .startPrice(request.getStartPrice())
                .minPrice(request.getMinPrice())
                .dropInterval(request.getDropInterval() > 0 ? request.getDropInterval() : 600)
                .dropAmount(request.getDropAmount() > 0 ? request.getDropAmount() : 5000)
                .imageUrl(request.getImageUrl() != null && !request.getImageUrl().isBlank() 
                    ? request.getImageUrl() 
                    : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800")
                .sellerId(actualSellerId)
                .sellerName(request.getSellerName() != null ? request.getSellerName() : "티켓판매자")
                .sellerEmail(request.getSellerEmail() != null ? request.getSellerEmail() : "seller@dropick.com")
                .status(Product.ProductStatus.ACTIVE)
                .auctionStartTime(auctionStartTime)
                .auctionEndTime(auctionEndTime)
                .remainingSeats(request.getRemainingSeats() != null ? request.getRemainingSeats() : 1)
                .description(request.getDescription())
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

    public Product getProductEntity(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // 더치옥션 실시간 가격 계산 로직 (서버 사이드)
    public int calculateCurrentPrice(Product product) {
        if (product == null) return 0;
        if (product.getStatus() == Product.ProductStatus.SOLD) {
            return product.getMinPrice();
        }
        
        long secondsElapsed = Duration.between(product.getCreatedAt() != null ? product.getCreatedAt() : LocalDateTime.now(), LocalDateTime.now()).getSeconds();
        if (secondsElapsed < 0) return product.getStartPrice();
        
        int interval = product.getDropInterval() > 0 ? product.getDropInterval() : 60;
        long dropCount = secondsElapsed / interval;
        int priceDrop = (int) (dropCount * product.getDropAmount());
        int currentPrice = product.getStartPrice() - priceDrop;
        
        return Math.max(currentPrice, product.getMinPrice());
    }
}
