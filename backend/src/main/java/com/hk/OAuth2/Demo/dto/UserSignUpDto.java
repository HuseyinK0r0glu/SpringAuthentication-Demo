package com.hk.OAuth2.Demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignUpDto {

    private String email;
    private String username;
    private String password;
    private String confirmPassword;
    private String phoneNumber;

}
