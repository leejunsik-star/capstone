package com.dropick.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // 로컬 개발 + AWS Amplify 배포 URL 모두 허용
                .allowedOriginPatterns(
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "http://127.0.0.1:*",
                    "https://*.amplifyapp.com",
                    "http://*.elasticbeanstalk.com",
                    "https://*.elasticbeanstalk.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
