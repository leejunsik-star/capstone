package com.dropick.api.dto.product;

import lombok.Getter;
import lombok.Setter;

public class ProductRequest {
    @Getter @Setter
    public static class Create {
        private String title;
        private String subtitle;
        private String category;
        private String categoryLabel;
        private String venue;
        private String seat;
        private String seatGrade;
        private String eventDate;
        private int startPrice;
        private int minPrice;
        private int dropInterval;
        private int dropAmount;
        private String imageUrl;
        private Long sellerId;
        private String sellerName;
        private String sellerEmail;
        private String status;
        private String auctionStartTime;
        private String auctionEndTime;
        private Integer remainingSeats;
        private String description;
    }
}
