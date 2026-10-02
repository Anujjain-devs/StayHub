package com.stayhub.service;

import java.util.List;

import com.stayhub.dto.UserRequestDto;
import com.stayhub.dto.UserResponseDto;

public interface UserService {

    UserResponseDto register(UserRequestDto dto);

    List<UserResponseDto> getAllUsers();

    UserResponseDto getUserById(Long id);

    UserResponseDto updateUser(Long id, UserRequestDto dto);

    void deleteUser(Long id);

}