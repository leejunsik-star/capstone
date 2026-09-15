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

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        return ApiResponse.success("전체 상품 조회 성공", productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Long id) {
        try {
            return ApiResponse.success("상품 상세 조회 성공", productService.getProductById(id));
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping
    public ApiResponse<ProductResponse> createProduct(@RequestBody ProductRequest.Create request, HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            Long sellerId = jwtTokenProvider.getUserIdFromToken(token.substring(7));
            ProductResponse response = productService.createProduct(request, sellerId);
            return ApiResponse.success("상품 등록 성공", response);
        }
        return ApiResponse.error("인증이 필요합니다.");
    }
}
