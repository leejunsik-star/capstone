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
    private String seatGrade;
    private LocalDateTime eventDate;
    private int startPrice;
    private int minPrice;
    private int dropInterval;
    private int dropAmount;
    private Long sellerId;
    private String sellerName;
    private String sellerEmail;
    private String imageUrl;
    private String status;
    private int currentPrice;
    private LocalDateTime auctionStartTime;
    private LocalDateTime auctionEndTime;
    private Integer remainingSeats;
    private String description;

    public ProductResponse(Product product, int currentPrice) {
        this.id = product.getId();
        this.title = product.getTitle();
        this.category = product.getCategory();
        this.venue = product.getVenue();
        this.seat = product.getSeat();
        this.seatGrade = product.getSeatGrade();
        this.eventDate = product.getEventDate();
        this.startPrice = product.getStartPrice();
        this.minPrice = product.getMinPrice();
        this.dropInterval = product.getDropInterval();
        this.dropAmount = product.getDropAmount();
        this.sellerId = product.getSellerId();
        this.sellerName = product.getSellerName();
        this.sellerEmail = product.getSellerEmail();
        this.imageUrl = product.getImageUrl();
        this.status = product.getStatus() != null ? product.getStatus().name() : "ACTIVE";
        this.currentPrice = currentPrice;
        this.auctionStartTime = product.getAuctionStartTime();
        this.auctionEndTime = product.getAuctionEndTime();
        this.remainingSeats = product.getRemainingSeats();
        this.description = product.getDescription();
    }
}
