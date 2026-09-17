package com.dropick.api.domain.order;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private String productTitle;
    private String venue;
    private String seat;
    private LocalDateTime eventDate;
    
    private Long buyerId;
    private String buyerName;
    private String buyerEmail;
    
    private int paidPrice;
    private int startPrice;
    private int savedPrice;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String paymentKey;
    private String paymentMethod;

    private LocalDateTime orderDate;

    public enum OrderStatus {
        PENDING, PAID, RECEIPT_CONFIRMED, CANCELLED, REFUNDED
    }

    @Builder
    public Order(Long productId, String productTitle, String venue, String seat, LocalDateTime eventDate,
                 Long buyerId, String buyerName, String buyerEmail,
                 int paidPrice, int startPrice, int savedPrice,
                 OrderStatus status, String paymentKey, String paymentMethod) {
        this.productId = productId;
        this.productTitle = productTitle;
        this.venue = venue;
        this.seat = seat;
        this.eventDate = eventDate;
        this.buyerId = buyerId;
        this.buyerName = buyerName;
        this.buyerEmail = buyerEmail;
        this.paidPrice = paidPrice;
        this.startPrice = startPrice;
        this.savedPrice = savedPrice;
        this.status = status != null ? status : OrderStatus.PAID;
        this.paymentKey = paymentKey;
        this.paymentMethod = paymentMethod;
        this.orderDate = LocalDateTime.now();
    }

    public void updateStatus(OrderStatus status) {
        this.status = status;
    }
}
