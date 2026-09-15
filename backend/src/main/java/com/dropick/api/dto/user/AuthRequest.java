package com.dropick.api.dto.user;

import lombok.Getter;
import lombok.Setter;

public class AuthRequest {
    @Getter @Setter
    public static class Login {
        private String email;
        private String password;
    }

    @Getter @Setter
    public static class SignUp {
        private String name;
        private String email;
        private String password;
        private String phone;
    }
}
