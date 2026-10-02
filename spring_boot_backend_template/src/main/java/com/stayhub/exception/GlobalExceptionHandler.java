package com.stayhub.exception;

import java.time.LocalDateTime;
import org.springframework.security.access.AccessDeniedException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public org.springframework.http.ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex,
			HttpServletRequest request) {

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), HttpStatus.NOT_FOUND.value(), "Not Found",
				ex.getMessage(), request.getRequestURI());

		return new org.springframework.http.ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(DuplicateResourceException.class)
	public org.springframework.http.ResponseEntity<ErrorResponse> handleDuplicate(DuplicateResourceException ex,
			HttpServletRequest request) {

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), HttpStatus.CONFLICT.value(), "Conflict",
				ex.getMessage(), request.getRequestURI());

		return new org.springframework.http.ResponseEntity<>(error, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(BadRequestException.class)
	public org.springframework.http.ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex,
			HttpServletRequest request) {

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(), "Bad Request",
				ex.getMessage(), request.getRequestURI());

		return new org.springframework.http.ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public org.springframework.http.ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex,
			HttpServletRequest request) {

		String message = ex.getBindingResult().getFieldError().getDefaultMessage();

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(),
				"Validation Failed", message, request.getRequestURI());

		return new org.springframework.http.ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public org.springframework.http.ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex,
			HttpServletRequest request) {

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), HttpStatus.FORBIDDEN.value(), "Forbidden",
				ex.getMessage(), request.getRequestURI());

		return new org.springframework.http.ResponseEntity<>(error, HttpStatus.FORBIDDEN);
	}

	@ExceptionHandler(Exception.class)
	public org.springframework.http.ResponseEntity<ErrorResponse> handleGeneric(Exception ex,
			HttpServletRequest request) {

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Internal Server Error", ex.getMessage(), request.getRequestURI());

		return new org.springframework.http.ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}