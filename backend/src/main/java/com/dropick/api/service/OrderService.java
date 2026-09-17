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
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderResponse createOrder(OrderRequest.Create request, Long buyerId) {
        Product product = null;
        if (request.getProductId() != null) {
            product = productRepository.findById(request.getProductId()).orElse(null);
        }

        Order order = Order.builder()
                .productId(request.getProductId())
                .productTitle(request.getProductTitle() != null ? request.getProductTitle() : (product != null ? product.getTitle() : "티켓"))
                .venue(request.getVenue() != null ? request.getVenue() : (product != null ? product.getVenue() : ""))
                .seat(request.getSeat() != null ? request.getSeat() : (product != null ? product.getSeat() : ""))
                .eventDate(request.getEventDate() != null ? request.getEventDate() : (product != null ? product.getEventDate() : null))
                .buyerId(buyerId)
                .buyerName(request.getBuyerName())
                .buyerEmail(request.getBuyerEmail())
                .paidPrice(request.getPaidPrice())
                .startPrice(request.getStartPrice())
                .savedPrice(request.getSavedPrice())
                .status(Order.OrderStatus.PAID)
                .paymentKey(request.getPaymentKey())
                .paymentMethod(request.getPaymentMethod())
                .build();

        if (product != null) {
            product.updateStatus(Product.ProductStatus.SOLD);
            productRepository.save(product);
        }

        Order saved = orderRepository.save(order);
        return new OrderResponse(saved);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByBuyer(Long buyerId) {
        return orderRepository.findByBuyerId(buyerId).stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        return new OrderResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long id, String reason) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        order.updateStatus(Order.OrderStatus.REFUNDED);
        return new OrderResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse confirmPayment(OrderRequest.PaymentConfirm request, Long buyerId) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        Order order = Order.builder()
                .productId(product.getId())
                .productTitle(product.getTitle())
                .venue(product.getVenue())
                .seat(product.getSeat())
                .eventDate(product.getEventDate())
                .buyerId(buyerId)
                .paidPrice(request.getAmount())
                .status(Order.OrderStatus.PAID)
                .paymentKey(request.getPaymentKey())
                .build();

        product.updateStatus(Product.ProductStatus.SOLD);
        productRepository.save(product);

        Order saved = orderRepository.save(order);
        return new OrderResponse(saved);
    }

    @Transactional
    public OrderResponse confirmReceipt(Long orderId, Long buyerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        if (buyerId != null && order.getBuyerId() != null && !order.getBuyerId().equals(buyerId)) {
            throw new IllegalArgumentException("본인의 주문만 수령 확인할 수 있습니다.");
        }

        order.updateStatus(Order.OrderStatus.RECEIPT_CONFIRMED);
        return new OrderResponse(orderRepository.save(order));
    }
}
