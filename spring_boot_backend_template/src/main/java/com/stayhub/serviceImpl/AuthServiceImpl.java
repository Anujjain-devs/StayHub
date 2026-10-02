package com.stayhub.serviceImpl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.stayhub.dto.LoginRequestDto;
import com.stayhub.dto.LoginResponseDto;
import com.stayhub.entity.User;
import com.stayhub.repository.UserRepository;
import com.stayhub.security.JwtService;
import com.stayhub.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	private final UserRepository userRepository;

	@Override
	public LoginResponseDto login(LoginRequestDto dto) {

		// Authenticate email and password
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));

		// Fetch authenticated user
		User user = userRepository.findByEmail(dto.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));

		// Generate JWT
		String token = jwtService.generateToken(user.getEmail());

		// Return response
		return new LoginResponseDto(token, user.getRole().name(), user.getId(), user.getFirstName(),
				user.getLastName());
	}
}