package com.dropick.api.controller;

import com.dropick.api.common.ApiResponse;
import com.dropick.api.dto.product.ProductRequest;
import com.dropick.api.dto.product.ProductResponse;
import com.dropick.api.security.JwtTokenProvider;
import com.dropick.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final JwtTokenProvider jwtTokenProvider;

    private Long getUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            try {
                return jwtTokenProvider.getUserIdFromToken(token.substring(7));
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    @GetMapping("/products")
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        return ApiResponse.success("전체 상품 조회 성공", productService.getAllProducts());
    }

    @GetMapping("/products/{id}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Long id) {
        try {
            return ApiResponse.success("상품 상세 조회 성공", productService.getProductById(id));
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/products/{id}/verify")
    public ApiResponse<Map<String, Object>> verifyProduct(@PathVariable Long id) {
        com.dropick.api.domain.product.Product product = productService.getProductEntity(id);
        if (product == null) {
            return ApiResponse.error("존재하지 않는 상품입니다.");
        }
        if (product.getStatus() == com.dropick.api.domain.product.Product.ProductStatus.SOLD) {
            return ApiResponse.error("이미 판매 완료된 상품입니다.");
        }
        Map<String, Object> map = new HashMap<>();
        map.put("available", true);
        map.put("currentPrice", productService.calculateCurrentPrice(product));
        map.put("status", product.getStatus().name());
        return ApiResponse.success("구매 가능", map);
    }

    @PostMapping({"/products", "/admin/products"})
    public ApiResponse<ProductResponse> createProduct(@RequestBody ProductRequest.Create request, HttpServletRequest httpRequest) {
        Long sellerId = getUserId(httpRequest);
        try {
            ProductResponse response = productService.createProduct(request, sellerId);
            return ApiResponse.success("상품 등록 성공", response);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
