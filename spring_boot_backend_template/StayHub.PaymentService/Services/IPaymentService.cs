using System.Collections.Generic;
using System.Threading.Tasks;
using StayHub.PaymentService.DTOs;

namespace StayHub.PaymentService.Services
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> CreateOrderAsync(PaymentRequestDto dto, string? bearerToken);
        Task<PaymentResponseDto> VerifyPaymentAsync(PaymentVerifyRequestDto dto, string? bearerToken);
        Task<IEnumerable<PaymentResponseDto>> GetAllPaymentsAsync();
        Task<PaymentResponseDto> GetPaymentByIdAsync(long id);
        Task<PaymentResponseDto> GetPaymentByBookingIdAsync(long bookingId);
        Task DeletePaymentAsync(long id);
    }
}
