using System;
using StayHub.PaymentService.Models;

namespace StayHub.PaymentService.DTOs
{
    public class PaymentResponseDto
    {
        public long Id { get; set; }
        public decimal Amount { get; set; }
        public DateOnly PaymentDate { get; set; }
        public PaymentStatus Status { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public string? TransactionId { get; set; }
        public string? RazorpayOrderId { get; set; }
        public string? RazorpayPaymentId { get; set; }
        public long BookingId { get; set; }
    }
}
