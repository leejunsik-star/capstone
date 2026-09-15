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
    private LocalDateTime eventDate;

    private int startPrice;
    private int minPrice;
    private int dropInterval;
    private int dropAmount;

    private Long sellerId;
    private String imageUrl;
    
    @Enumerated(EnumType.STRING)
    private ProductStatus status;
    
    private LocalDateTime createdAt;

    public enum ProductStatus {
        SCHEDULED, ACTIVE, SOLD, ENDED
    }

    @Builder
    public Product(String title, String category, String venue, String seat, LocalDateTime eventDate, 
                   int startPrice, int minPrice, int dropInterval, int dropAmount, 
                   Long sellerId, String imageUrl, ProductStatus status) {
        this.title = title;
        this.category = category;
        this.venue = venue;
        this.seat = seat;
        this.eventDate = eventDate;
        this.startPrice = startPrice;
        this.minPrice = minPrice;
        this.dropInterval = dropInterval;
        this.dropAmount = dropAmount;
        this.sellerId = sellerId;
        this.imageUrl = imageUrl;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    public void updateStatus(ProductStatus status) {
        this.status = status;
    }
}
