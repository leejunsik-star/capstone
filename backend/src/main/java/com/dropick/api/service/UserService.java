package com.dropick.api.service;

import com.dropick.api.domain.user.User;
import com.dropick.api.domain.user.UserRepository;
import com.dropick.api.dto.user.AuthRequest;
import com.dropick.api.dto.user.AuthResponse;
import com.dropick.api.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse signup(AuthRequest.SignUp request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .build();
        
        userRepository.save(user);

        String token = jwtTokenProvider.createToken(user.getId(), user.getEmail());
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(user.getId(), user.getName(), user.getEmail(), user.getPhone());
        return new AuthResponse(token, userDto);
    }

    public AuthResponse login(AuthRequest.Login request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("잘못된 비밀번호입니다.");
        }

        String token = jwtTokenProvider.createToken(user.getId(), user.getEmail());
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(user.getId(), user.getName(), user.getEmail(), user.getPhone());
        return new AuthResponse(token, userDto);
    }
}
