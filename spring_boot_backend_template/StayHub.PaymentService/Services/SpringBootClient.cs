using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using StayHub.PaymentService.DTOs;

namespace StayHub.PaymentService.Services
{
    public class SpringBootClient : ISpringBootClient
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<SpringBootClient> _logger;

        public SpringBootClient(HttpClient httpClient, IConfiguration configuration, ILogger<SpringBootClient> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            
            var baseUrl = configuration["SpringBoot:BaseUrl"] ?? "http://localhost:8080";
            _httpClient.BaseAddress = new Uri(baseUrl);
        }

        public async Task<SpringBootBookingDto?> GetBookingByIdAsync(long bookingId, string? bearerToken)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, $"/api/bookings/{bookingId}");
                if (!string.IsNullOrEmpty(bearerToken))
                {
                    request.Headers.Authorization = AuthenticationHeaderValue.Parse(bearerToken);
                }

                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadFromJsonAsync<SpringBootBookingDto>();
                }

                _logger.LogWarning("Spring Boot returned status {StatusCode} when fetching booking {BookingId}", response.StatusCode, bookingId);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to connect to Spring Boot monolith service for booking {BookingId}", bookingId);
                throw new InvalidOperationException("Spring Boot Monolith service is unavailable.", ex);
            }
        }

        public async Task<bool> ConfirmBookingStatusAsync(long bookingId, string? bearerToken)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Put, $"/api/bookings/{bookingId}/confirm-status");
                if (!string.IsNullOrEmpty(bearerToken))
                {
                    request.Headers.Authorization = AuthenticationHeaderValue.Parse(bearerToken);
                }

                var response = await _httpClient.SendAsync(request);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update booking status in Spring Boot for booking {BookingId}", bookingId);
                return false;
            }
        }
    }
}
