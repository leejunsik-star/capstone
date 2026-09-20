package com.dropick.api.controller;

import com.dropick.api.common.ApiResponse;
import com.dropick.api.domain.order.Order;
import com.dropick.api.domain.order.OrderRepository;
import com.dropick.api.domain.product.Product;
import com.dropick.api.domain.product.ProductRepository;
import com.dropick.api.domain.user.UserRepository;
import com.dropick.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    @GetMapping("/dashboard")
    public ApiResponse<Map<String, Object>> getDashboard() {
        List<Product> allProducts = productRepository.findAll();
        List<Order> allOrders = orderRepository.findAll();

        // 3. 진행 중 경매 활성화 (Enum 비교)
        List<Product> activeProducts = allProducts.stream()
                .filter(p -> p.getStatus() == Product.ProductStatus.ACTIVE)
                .collect(Collectors.toList());

        // 1. 환불/취소 건을 제외한 실제 유효 결제 주문
        List<Order> validOrders = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.PAID || o.getStatus() == Order.OrderStatus.RECEIPT_CONFIRMED)
                .collect(Collectors.toList());

        // 1. 환불한 건은 오늘 결제금액에 미포함
        long todaySales = validOrders.stream()
                .mapToLong(Order::getPaidPrice)
                .sum();

        // 2. 두 개의 주문 중 하나가 환불일 때 오늘 주문건수는 2, 판매완료는 1
        int todayOrdersCount = allOrders.size();
        long soldTicketsCount = validOrders.size();

        // 3. 진행 중 경매 수 및 24시간 내 종료 예정 경매 수
        int activeAuctionsCount = activeProducts.size();
        long endingSoonCount = activeProducts.stream()
                .filter(p -> p.getAuctionEndTime() != null && p.getAuctionEndTime().isBefore(LocalDateTime.now().plusHours(24)))
                .count();

        // 4. 데이터베이스 상의 실제 전체 회원 수
        long totalMembersCount = userRepository.count();

        // 최근 주문 6건
        List<Map<String, Object>> recentOrders = allOrders.stream()
                .sorted(Comparator.comparing(Order::getOrderDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(6)
                .map(o -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", o.getId());
                    m.put("productTitle", o.getProductTitle());
                    m.put("paidPrice", o.getPaidPrice());
                    m.put("status", o.getStatus() != null ? o.getStatus().name() : "UNKNOWN");
                    m.put("buyerName", o.getBuyerName() != null ? o.getBuyerName() : "구매자");
                    m.put("orderDate", o.getOrderDate() != null ? o.getOrderDate().toString() : null);
                    return m;
                })
                .collect(Collectors.toList());

        // 진행 중 경매 실시간 가격 반영 (최대 5건)
        List<Map<String, Object>> activeAuctions = activeProducts.stream()
                .limit(5)
                .map(p -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", p.getId());
                    m.put("title", p.getTitle());
                    m.put("venue", p.getVenue());
                    m.put("startPrice", p.getStartPrice());
                    m.put("currentPrice", productService.calculateCurrentPrice(p));
                    m.put("dropAmount", p.getDropAmount());
                    m.put("status", p.getStatus() != null ? p.getStatus().name() : "ACTIVE");
                    m.put("imageUrl", p.getImageUrl());
                    return m;
                })
                .collect(Collectors.toList());

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("todaySales", todaySales);
        data.put("todayOrdersCount", todayOrdersCount);
        data.put("activeAuctionsCount", activeAuctionsCount);
        data.put("endingSoonCount", endingSoonCount);
        data.put("soldTicketsCount", soldTicketsCount);
        data.put("totalMembersCount", totalMembersCount);
        data.put("recentOrders", recentOrders);
        data.put("activeAuctions", activeAuctions);

        return ApiResponse.success("대시보드 조회 성공", data);
    }

    @GetMapping("/users")
    public ApiResponse<List<Map<String, Object>>> getUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(u -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", u.getId());
                    m.put("name", u.getName());
                    m.put("email", u.getEmail());
                    m.put("role", u.getEmail().contains("admin") ? "ADMIN" : "USER");
                    return m;
                })
                .collect(Collectors.toList());
        return ApiResponse.success("회원 목록 조회 성공", users);
    }

    @GetMapping("/orders")
    public ApiResponse<List<Order>> getAllOrders() {
        return ApiResponse.success("전체 주문 목록 조회 성공", orderRepository.findAll());
    }

    @GetMapping("/settlements")
    public ApiResponse<List<Map<String, Object>>> getSettlements() {
        List<Order> validOrders = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.PAID || o.getStatus() == Order.OrderStatus.RECEIPT_CONFIRMED)
                .collect(Collectors.toList());

        List<Map<String, Object>> settlements = validOrders.stream().map(o -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("orderId", o.getId());
            m.put("productTitle", o.getProductTitle());
            m.put("buyerName", o.getBuyerName() != null ? o.getBuyerName() : "구매자");
            m.put("sellerName", "판매자");
            m.put("paidPrice", o.getPaidPrice());
            m.put("platformFee", (int) Math.floor(o.getPaidPrice() * 0.03));
            m.put("sellerSettlementAmount", (int) Math.floor(o.getPaidPrice() * 0.97));
            m.put("status", o.getStatus() == Order.OrderStatus.RECEIPT_CONFIRMED ? "SETTLEMENT_DONE" : "SETTLEMENT_PENDING");
            m.put("settledAt", o.getStatus() == Order.OrderStatus.RECEIPT_CONFIRMED 
                    ? (o.getOrderDate() != null ? o.getOrderDate().toString() : LocalDateTime.now().toString()) 
                    : null);
            return m;
        }).collect(Collectors.toList());

        return ApiResponse.success("정산 현황 조회 성공", settlements);
    }

    @DeleteMapping("/products/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ApiResponse.error("존재하지 않는 상품입니다.");
        }
        productRepository.deleteById(id);
        return ApiResponse.success("상품이 성공적으로 삭제되었습니다.", null);
    }
}
