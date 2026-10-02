namespace StayHub.PaymentService.DTOs
{
    public class SpringBootBookingDto
    {
        public long Id { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
