package com.hk.OAuth2.Demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserDto {

    private Long id;
    private String username;
    private String email;
    private String provider;
    private String oauth2Id;
    private String picture;
    private String local_picture;
    private List<String> roles;
    private boolean isProfilePictureVisible;

    public UserDto(Long id,
                   String username,
                   String email,
                   String provider,
                   String oauth2Id,
                   String picture,
                   String local_picture,
                   List<String> roles,
                   boolean isProfilePictureVisible) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.provider = provider;
        this.oauth2Id = oauth2Id;
        this.picture = picture;
        this.local_picture = local_picture;
        this.roles = roles;
        this.isProfilePictureVisible = isProfilePictureVisible;
    }
}
