package com.stayhub.service;

import com.stayhub.dto.LoginRequestDto;
import com.stayhub.dto.LoginResponseDto;

public interface AuthService {

	LoginResponseDto login(LoginRequestDto dto);

}