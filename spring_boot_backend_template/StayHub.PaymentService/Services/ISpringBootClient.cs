using System.Threading.Tasks;
using StayHub.PaymentService.DTOs;

namespace StayHub.PaymentService.Services
{
    public interface ISpringBootClient
    {
        Task<SpringBootBookingDto?> GetBookingByIdAsync(long bookingId, string? bearerToken);
        Task<bool> ConfirmBookingStatusAsync(long bookingId, string? bearerToken);
    }
}
