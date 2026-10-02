using System.ComponentModel.DataAnnotations;

namespace StayHub.PaymentService.DTOs
{
    public class PaymentRequestDto
    {
        [Required(ErrorMessage = "Booking ID is required.")]
        public long BookingId { get; set; }
    }
}
