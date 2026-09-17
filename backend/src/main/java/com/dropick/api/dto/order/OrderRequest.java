package com.dropick.api.dto.order;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

public class OrderRequest {
    @Getter @Setter
    public static class Create {
        private Long productId;
        private String productTitle;
        private String category;
        private String venue;
        private LocalDateTime eventDate;
        private String seat;
        private String seatGrade;
        private String imageUrl;
        private int paidPrice;
        private int startPrice;
        private int savedPrice;
        private String buyerName;
        private String buyerPhone;
        private String buyerEmail;
        private String paymentMethod;
        private String paymentKey;
    }

    @Getter @Setter
    public static class PaymentConfirm {
        private String paymentKey;
        private String orderId;
        private Long productId;
        private int amount;
    }

    @Getter @Setter
    public static class Cancel {
        private String reason;
    }
}
