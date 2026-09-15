package com.dropick.api.controller;

import com.dropick.api.common.ApiResponse;
import com.dropick.api.dto.order.OrderRequest;
import com.dropick.api.dto.order.OrderResponse;
import com.dropick.api.security.JwtTokenProvider;
import com.dropick.api.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final JwtTokenProvider jwtTokenProvider;

    private Long getUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            return jwtTokenProvider.getUserIdFromToken(token.substring(7));
        }
        return null;
    }

    @PostMapping("/payments/confirm")
    public ApiResponse<OrderResponse> confirmPayment(@RequestBody OrderRequest.PaymentConfirm request, HttpServletRequest httpRequest) {
        Long buyerId = getUserId(httpRequest);
        if (buyerId == null) return ApiResponse.error("인증이 필요합니다.");

        try {
            OrderResponse response = orderService.confirmPayment(request, buyerId);
            return ApiResponse.success("결제 승인 완료", response);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/{orderId}/confirm-receipt")
    public ApiResponse<OrderResponse> confirmReceipt(@PathVariable Long orderId, HttpServletRequest httpRequest) {
        Long buyerId = getUserId(httpRequest);
        if (buyerId == null) return ApiResponse.error("인증이 필요합니다.");

        try {
            OrderResponse response = orderService.confirmReceipt(orderId, buyerId);
            return ApiResponse.success("수령 확인 및 정산 예약 완료", response);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
