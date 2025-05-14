package com.hk.OAuth2.Demo.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Getter
@Configuration
public class GeminiConfig {

    @Value("${gemini.api.key}")
    private String apiKey;

}
