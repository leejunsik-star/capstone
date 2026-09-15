package com.dropick.api.dto.product;

import com.dropick.api.domain.product.Product;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class ProductResponse {
    private Long id;
    private String title;
    private String category;
    private String venue;
    private String seat;
    private LocalDateTime eventDate;
    private int startPrice;
    private int minPrice;
    private int dropInterval;
    private int dropAmount;
    private Long sellerId;
    private String imageUrl;
    private String status;
    private int currentPrice; // 실시간 계산된 가격

    public ProductResponse(Product product, int currentPrice) {
        this.id = product.getId();
        this.title = product.getTitle();
        this.category = product.getCategory();
        this.venue = product.getVenue();
        this.seat = product.getSeat();
        this.eventDate = product.getEventDate();
        this.startPrice = product.getStartPrice();
        this.minPrice = product.getMinPrice();
        this.dropInterval = product.getDropInterval();
        this.dropAmount = product.getDropAmount();
        this.sellerId = product.getSellerId();
        this.imageUrl = product.getImageUrl();
        this.status = product.getStatus().name();
        this.currentPrice = currentPrice;
    }
}
