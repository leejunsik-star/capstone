package com.dropick.api;

import com.dropick.api.domain.product.Product;
import com.dropick.api.domain.product.ProductRepository;
import com.dropick.api.domain.user.User;
import com.dropick.api.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 이미 데이터가 있으면 스킵 (중복 방지)
        if (productRepository.count() > 0) return;

        // 테스트 판매자 유저 생성
        User seller = User.builder()
                .name("드로픽 운영팀")
                .email("seller@dropick.com")
                .password(passwordEncoder.encode("dropick123"))
                .phone("010-1234-5678")
                .build();
        userRepository.save(seller);

        // 테스트 구매자 유저 생성
        User buyer = User.builder()
                .name("홍길동")
                .email("user@dropick.com")
                .password(passwordEncoder.encode("user1234"))
                .phone("010-9876-5432")
                .build();
        userRepository.save(buyer);

        // 더미 상품 12개 등록
        Object[][] products = {
            {"[BTS] 월드투어 PERMISSION TO DANCE ON STAGE - 서울", "CONCERT", "잠실올림픽주경기장", "VIP석 A구역 12열 15번", LocalDateTime.now().plusDays(10), 350000, 120000, 60, 10000, "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600"},
            {"[세계적 EDM DJ] Alan Walker Live in Seoul 2026", "CONCERT", "KSPO돔 (체조경기장)", "R석 8열 22번", LocalDateTime.now().plusDays(7), 180000, 80000, 90, 5000, "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600"},
            {"뮤지컬 레미제라블 - 25주년 기념 내한공연", "MUSICAL", "샤롯데씨어터", "S석 오케스트라 5열 7번", LocalDateTime.now().plusDays(5), 220000, 100000, 120, 8000, "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600"},
            {"프리미어12 한국 vs 일본 야구 국가대표 결승전", "SPORTS", "고척스카이돔", "1루 지정석 12구역 5열 14번", LocalDateTime.now().plusDays(3), 95000, 40000, 30, 3000, "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600"},
            {"[모네부터 현대까지] 인상주의 100년展 - 국립현대미술관", "EXHIBITION", "국립현대미술관 서울관", "일반 관람권 (자유입장)", LocalDateTime.now().plusDays(15), 30000, 10000, 300, 1000, "https://images.unsplash.com/photo-1536924430914-91f9e2041b83?w=600"},
            {"연극 [아마데우스] - 국립극단 블랙박스 극장", "THEATER", "명동예술극장", "A석 3열 11번", LocalDateTime.now().plusDays(6), 75000, 30000, 180, 3000, "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600"},
            {"[아이유 IU] HEREH WORLD TOUR 앙코르 - 부산", "CONCERT", "BEXCO 오디토리움", "S석 6열 8번", LocalDateTime.now().plusDays(12), 165000, 70000, 90, 5000, "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600"},
            {"뮤지컬 [위키드] WICKED 10주년 기념 내한공연", "MUSICAL", "블루스퀘어 신한카드홀", "R석 2층 3열 9번", LocalDateTime.now().plusDays(8), 198000, 90000, 120, 6000, "https://images.unsplash.com/photo-1470019693664-1d202d2be176?w=600"},
            {"2026 KBO 한국시리즈 LG 트윈스 vs KT 위즈", "SPORTS", "잠실야구장", "중앙 지정석 7구역 10열 33번", LocalDateTime.now().plusDays(2), 80000, 35000, 30, 2500, "https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=600"},
            {"[반 고흐 미디어아트] 반 고흐 : 10년의 기록展", "EXHIBITION", "동대문 DDP 알림터", "미디어아트 특별관람권", LocalDateTime.now().plusDays(20), 25000, 8000, 240, 1000, "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600"},
            {"[뉴진스 NewJeans] GET UP 월드투어 서울 콘서트", "CONCERT", "인천 인스파이어 아레나", "FRONT석 A구역 2열 7번", LocalDateTime.now().plusDays(14), 320000, 130000, 60, 10000, "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600"},
            {"2026 FC서울 vs 전북 현대 K리그1 슈퍼매치", "SPORTS", "서울월드컵경기장", "홈 응원석 J구역 22열 11번", LocalDateTime.now().plusDays(4), 55000, 20000, 45, 2000, "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600"},
        };

        LocalDateTime targetEndTime = LocalDateTime.now().plusDays(1).withHour(17).withMinute(0).withSecond(0);
        long totalSeconds = java.time.Duration.between(LocalDateTime.now(), targetEndTime).getSeconds();
        if (totalSeconds <= 0) totalSeconds = 86400; // 안전장치 (24시간)

        for (Object[] p : products) {
            int startPrice = (Integer) p[5];
            int minPrice = (Integer) p[6];
            int dropAmount = (Integer) p[8];
            int dropsNeeded = (startPrice - minPrice) / dropAmount;
            int dynamicDropInterval = (int) (totalSeconds / (dropsNeeded > 0 ? dropsNeeded : 1));

            productRepository.save(Product.builder()
                    .title((String) p[0])
                    .category((String) p[1])
                    .venue((String) p[2])
                    .seat((String) p[3])
                    .eventDate((LocalDateTime) p[4])
                    .startPrice(startPrice)
                    .minPrice(minPrice)
                    .dropInterval(dynamicDropInterval)
                    .dropAmount(dropAmount)
                    .imageUrl((String) p[9])
                    .sellerId(seller.getId())
                    .status(Product.ProductStatus.ACTIVE)
                    .auctionStartTime(LocalDateTime.now())
                    .auctionEndTime(targetEndTime)
                    .build());
        }

        System.out.println("✅ DROPICK 더미 데이터 초기화 완료! 상품 " + productRepository.count() + "개 등록됨.");
    }
}
