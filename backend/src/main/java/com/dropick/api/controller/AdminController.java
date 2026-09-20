package com.dropick.api.controller;

import com.dropick.api.common.ApiResponse;
import com.dropick.api.domain.order.Order;
import com.dropick.api.domain.order.OrderRepository;
import com.dropick.api.domain.product.Product;
import com.dropick.api.domain.product.ProductRepository;
import com.dropick.api.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    public ApiResponse<Map<String, Object>> getDashboard() {
        List<Product> allProducts = productRepository.findAll();
        List<Order> allOrders = orderRepository.findAll();

        List<Product> activeProducts = allProducts.stream()
                .filter(p -> "ACTIVE".equals(p.getStatus()))
                .collect(Collectors.toList());

        List<Order> paidOrders = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.PAID)
                .collect(Collectors.toList());

        long todaySales = paidOrders.stream()
                .mapToLong(Order::getPaidPrice)
                .sum();

        // recentOrders: 최근 6건
        List<Map<String, Object>> recentOrders = allOrders.stream()
                .sorted(Comparator.comparing(Order::getOrderDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(6)
                .map(o -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", o.getId());
                    m.put("productTitle", o.getProductTitle());
                    m.put("paidPrice", o.getPaidPrice());
                    m.put("status", o.getStatus() != null ? o.getStatus().name() : "UNKNOWN");
                    m.put("buyerName", o.getBuyerName());
                    m.put("orderDate", o.getOrderDate() != null ? o.getOrderDate().toString() : null);
                    return m;
                })
                .collect(Collectors.toList());

        // activeAuctions: 진행 중 상품 최대 5건
        List<Map<String, Object>> activeAuctions = activeProducts.stream()
                .limit(5)
                .map(p -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", p.getId());
                    m.put("title", p.getTitle());
                    m.put("venue", p.getVenue());
                    m.put("startPrice", p.getStartPrice());
                    m.put("currentPrice", p.getStartPrice());
                    m.put("dropAmount", p.getDropAmount());
                    m.put("status", p.getStatus());
                    m.put("imageUrl", p.getImageUrl());
                    return m;
                })
                .collect(Collectors.toList());

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("todaySales", todaySales);
        data.put("todayOrdersCount", paidOrders.size());
        data.put("activeAuctionsCount", activeProducts.size());
        data.put("endingSoonCount", 0);
        data.put("soldTicketsCount", allProducts.stream().filter(p -> "SOLD".equals(p.getStatus())).count());
        data.put("totalMembersCount", userRepository.count());
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

    @DeleteMapping("/products/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ApiResponse.error("존재하지 않는 상품입니다.");
        }
        productRepository.deleteById(id);
        return ApiResponse.success("상품이 성공적으로 삭제되었습니다.", null);
    }
}
