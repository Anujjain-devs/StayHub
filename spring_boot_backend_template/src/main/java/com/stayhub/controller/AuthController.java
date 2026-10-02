package com.stayhub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.stayhub.dto.LoginRequestDto;
import com.stayhub.dto.LoginResponseDto;
import com.stayhub.service.AuthService;

import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @Valid @RequestBody LoginRequestDto dto) {

        LoginResponseDto response = authService.login(dto);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void testPassword() {
        System.out.println(passwordEncoder.matches(
                "123",
                "$2a$10$xFkMoVvlys2NWCmfqHLdS.OHCgiZxGQecw5wLqy5SYwsknF24oh1C"));
    }
}