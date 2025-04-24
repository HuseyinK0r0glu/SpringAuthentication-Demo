package com.hk.OAuth2.Demo.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequest {

    // username or email
    private String identifier;
    private String password;
    boolean rememberMe;

}
