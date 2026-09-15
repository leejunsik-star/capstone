package com.dropick.api.service;

import com.dropick.api.domain.order.Order;
import com.dropick.api.domain.order.OrderRepository;
import com.dropick.api.domain.product.Product;
import com.dropick.api.domain.product.ProductRepository;
import com.dropick.api.dto.order.OrderRequest;
import com.dropick.api.dto.order.OrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderResponse confirmPayment(OrderRequest.PaymentConfirm request, Long buyerId) {
        // 실제로는 여기서 토스 서버로 시크릿키를 이용해 2차 승인(POST https://api.tosspayments.com/v1/payments/confirm)을 호출해야 합니다.
        // 현재는 결제 금액이 일치한다고 가정하고 주문 생성만 수행.

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        Order order = Order.builder()
                .productId(product.getId())
                .buyerId(buyerId)
                .paidPrice(request.getAmount())
                .status(Order.OrderStatus.PAID)
                .paymentKey(request.getPaymentKey())
                .build();
        
        // 상품 상태 변경 (판매완료)
        product.updateStatus(Product.ProductStatus.SOLD);
        productRepository.save(product);

        Order saved = orderRepository.save(order);
        return new OrderResponse(saved);
    }

    @Transactional
    public OrderResponse confirmReceipt(Long orderId, Long buyerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        
        if (!order.getBuyerId().equals(buyerId)) {
            throw new IllegalArgumentException("본인의 주문만 수령 확인할 수 있습니다.");
        }

        order.updateStatus(Order.OrderStatus.RECEIPT_CONFIRMED);
        return new OrderResponse(orderRepository.save(order));
    }
}
