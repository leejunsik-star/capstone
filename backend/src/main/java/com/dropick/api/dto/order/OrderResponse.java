package com.dropick.api.dto.order;

import com.dropick.api.domain.order.Order;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class OrderResponse {
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
    private String status;
    private String paymentKey;
    private String paymentMethod;
    private LocalDateTime orderDate;

    public OrderResponse(Order order) {
        this.id = order.getId();
        this.productId = order.getProductId();
        this.productTitle = order.getProductTitle();
        this.venue = order.getVenue();
        this.seat = order.getSeat();
        this.eventDate = order.getEventDate();
        this.buyerId = order.getBuyerId();
        this.buyerName = order.getBuyerName();
        this.buyerEmail = order.getBuyerEmail();
        this.paidPrice = order.getPaidPrice();
        this.startPrice = order.getStartPrice();
        this.savedPrice = order.getSavedPrice();
        this.status = order.getStatus() != null ? order.getStatus().name() : "PAID";
        this.paymentKey = order.getPaymentKey();
        this.paymentMethod = order.getPaymentMethod();
        this.orderDate = order.getOrderDate();
    }
}
