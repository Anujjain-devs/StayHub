namespace StayHub.PaymentService.Models
{
    public enum PaymentStatus
    {
        PENDING,
        SUCCESS,
        FAILED
    }

    public enum PaymentMethod
    {
        CARD,
        UPI,
        NET_BANKING,
        RAZORPAY
    }
}
