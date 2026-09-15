package com.dropick.api.dto.product;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

public class ProductRequest {
    @Getter @Setter
    public static class Create {
        private String title;
        private String category;
        private String venue;
        private String seat;
        private LocalDateTime eventDate;
        private int startPrice;
        private int minPrice;
        private int dropInterval;
        private int dropAmount;
        private String imageUrl;
    }
}
