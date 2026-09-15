package com.dropick.api.dto.order;

import com.dropick.api.domain.order.Order;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class OrderResponse {
    private Long id;
    private Long productId;
    private int paidPrice;
    private String status;
    private String paymentKey;
    private LocalDateTime orderDate;

    public OrderResponse(Order order) {
        this.id = order.getId();
        this.productId = order.getProductId();
        this.paidPrice = order.getPaidPrice();
        this.status = order.getStatus().name();
        this.paymentKey = order.getPaymentKey();
        this.orderDate = order.getOrderDate();
    }
}
