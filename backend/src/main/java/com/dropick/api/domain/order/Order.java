package com.dropick.api.domain.order;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "orders") // MySQL 예약어 주의, 'orders'로 설정
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private Long buyerId;
    
    private int paidPrice;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String paymentKey; // 토스 결제키

    private LocalDateTime orderDate;

    public enum OrderStatus {
        PENDING, PAID, RECEIPT_CONFIRMED, CANCELLED, REFUNDED
    }

    @Builder
    public Order(Long productId, Long buyerId, int paidPrice, OrderStatus status, String paymentKey) {
        this.productId = productId;
        this.buyerId = buyerId;
        this.paidPrice = paidPrice;
        this.status = status;
        this.paymentKey = paymentKey;
        this.orderDate = LocalDateTime.now();
    }

    public void updateStatus(OrderStatus status) {
        this.status = status;
    }
}
