package com.dropick.api.dto.order;

import lombok.Getter;
import lombok.Setter;

public class OrderRequest {
    @Getter @Setter
    public static class PaymentConfirm {
        private String paymentKey;
        private String orderId; // 백엔드 내부 Order Id 생성 체계와 다를 수 있으나 현재는 Long id 대신 String orderId(uuid 등) 프론트 전달용
        private Long productId;
        private int amount;
    }
}
