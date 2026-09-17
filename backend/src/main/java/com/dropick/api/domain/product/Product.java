package com.dropick.api.domain.product;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
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
    
    @Column(length = 1000)
    private String imageUrl;
    
    @Enumerated(EnumType.STRING)
    private ProductStatus status;
    
    private LocalDateTime auctionStartTime;
    private LocalDateTime auctionEndTime;
    private Integer remainingSeats;
    
    @Column(length = 2000)
    private String description;

    private LocalDateTime createdAt;

    public enum ProductStatus {
        SCHEDULED, ACTIVE, SOLD, ENDED
    }

    @Builder
    public Product(String title, String category, String venue, String seat, String seatGrade, LocalDateTime eventDate, 
                   int startPrice, int minPrice, int dropInterval, int dropAmount, 
                   Long sellerId, String sellerName, String sellerEmail, String imageUrl, ProductStatus status,
                   LocalDateTime auctionStartTime, LocalDateTime auctionEndTime, Integer remainingSeats, String description) {
        this.title = title;
        this.category = category;
        this.venue = venue;
        this.seat = seat;
        this.seatGrade = seatGrade;
        this.eventDate = eventDate;
        this.startPrice = startPrice;
        this.minPrice = minPrice;
        this.dropInterval = dropInterval;
        this.dropAmount = dropAmount;
        this.sellerId = sellerId;
        this.sellerName = sellerName;
        this.sellerEmail = sellerEmail;
        this.imageUrl = imageUrl;
        this.status = status != null ? status : ProductStatus.ACTIVE;
        this.auctionStartTime = auctionStartTime != null ? auctionStartTime : LocalDateTime.now();
        this.auctionEndTime = auctionEndTime != null ? auctionEndTime : LocalDateTime.now().plusDays(2);
        this.remainingSeats = remainingSeats != null ? remainingSeats : 1;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    public void updateStatus(ProductStatus status) {
        this.status = status;
    }
}
