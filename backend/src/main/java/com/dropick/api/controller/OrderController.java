package com.dropick.api.controller;

import com.dropick.api.common.ApiResponse;
import com.dropick.api.dto.order.OrderRequest;
import com.dropick.api.dto.order.OrderResponse;
import com.dropick.api.security.JwtTokenProvider;
import com.dropick.api.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
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

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@RequestBody OrderRequest.Create request, HttpServletRequest httpRequest) {
        Long buyerId = getUserId(httpRequest);
        try {
            OrderResponse response = orderService.createOrder(request, buyerId);
            return ApiResponse.success("주문 생성 성공", response);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping
    public ApiResponse<List<OrderResponse>> getOrders(HttpServletRequest httpRequest) {
        Long buyerId = getUserId(httpRequest);
        if (buyerId != null) {
            return ApiResponse.success("주문 목록 조회 성공", orderService.getOrdersByBuyer(buyerId));
        }
        return ApiResponse.success("전체 주문 목록 조회 성공", orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getOrder(@PathVariable Long id) {
        try {
            return ApiResponse.success("주문 상세 조회 성공", orderService.getOrderById(id));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    public ApiResponse<OrderResponse> cancelOrder(@PathVariable Long id, @RequestBody(required = false) OrderRequest.Cancel cancelRequest) {
        String reason = cancelRequest != null && cancelRequest.getReason() != null ? cancelRequest.getReason() : "사용자 요청 취소";
        try {
            return ApiResponse.success("주문 취소 및 환불 완료", orderService.cancelOrder(id, reason));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/payments/confirm")
    public ApiResponse<OrderResponse> confirmPayment(@RequestBody OrderRequest.PaymentConfirm request, HttpServletRequest httpRequest) {
        Long buyerId = getUserId(httpRequest);
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
        try {
            OrderResponse response = orderService.confirmReceipt(orderId, buyerId);
            return ApiResponse.success("수령 확인 및 정산 예약 완료", response);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
