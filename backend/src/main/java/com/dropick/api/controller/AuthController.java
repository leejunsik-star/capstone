package com.dropick.api.controller;

import com.dropick.api.common.ApiResponse;
import com.dropick.api.dto.user.AuthRequest;
import com.dropick.api.dto.user.AuthResponse;
import com.dropick.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ApiResponse<AuthResponse> signup(@RequestBody AuthRequest.SignUp request) {
        try {
            AuthResponse response = userService.signup(request);
            return ApiResponse.success("회원가입 성공", response);
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody AuthRequest.Login request) {
        try {
            AuthResponse response = userService.login(request);
            return ApiResponse.success("로그인 성공", response);
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
