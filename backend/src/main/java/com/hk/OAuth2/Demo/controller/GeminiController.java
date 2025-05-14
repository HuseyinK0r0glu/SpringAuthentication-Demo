package com.hk.OAuth2.Demo.controller;

import com.hk.OAuth2.Demo.dto.MessageRequest;
import com.hk.OAuth2.Demo.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/ask")
    public ResponseEntity<?> ask(@RequestBody MessageRequest messageRequest) {
        String message = messageRequest.getMessage();
        Map<String,Object> response = new HashMap<>();
        String geminiResponse = geminiService.askToGemini(message);
        response.put("response",geminiResponse);
        return ResponseEntity.ok(response);
    }
}