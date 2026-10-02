using System.ComponentModel.DataAnnotations;

namespace StayHub.PaymentService.DTOs
{
    public class PaymentVerifyRequestDto
    {
        [Required(ErrorMessage = "Razorpay Order ID is required.")]
        public string RazorpayOrderId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Razorpay Payment ID is required.")]
        public string RazorpayPaymentId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Razorpay Signature is required.")]
        public string RazorpaySignature { get; set; } = string.Empty;
    }
}
