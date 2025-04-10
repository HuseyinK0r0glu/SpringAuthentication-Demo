package com.hk.OAuth2.Demo.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> handleGlobalException(Exception ex, WebRequest request) {

        Map<String,Object> response = new HashMap<>();
        response.put("timestamp" , LocalDateTime.now());
        response.put("status" , HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("error", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
        response.put("message" , ex.getMessage());
        response.put("path" , request.getDescription(false));

        logger.error("Error occurred at path: {}", request.getDescription(false));
        logger.error("Message: {}", ex.getMessage());
        logger.error("Status: {}", HttpStatus.INTERNAL_SERVER_ERROR.value());
        logger.error("Timestamp: {}", LocalDateTime.now());

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);

    }

    // custom exception classes and handlers can be added

}
