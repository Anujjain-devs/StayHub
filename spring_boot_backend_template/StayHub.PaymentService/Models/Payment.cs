using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StayHub.PaymentService.Models
{
    [Table("payments")]
    public class Payment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [Column("amount", TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        [Required]
        [Column("payment_date")]
        public DateOnly PaymentDate { get; set; }

        [Required]
        [Column("status")]
        public PaymentStatus Status { get; set; }

        [Required]
        [Column("payment_method")]
        public PaymentMethod PaymentMethod { get; set; }

        [Column("transaction_id")]
        [StringLength(100)]
        public string? TransactionId { get; set; }

        [Column("razorpay_order_id")]
        [StringLength(150)]
        public string? RazorpayOrderId { get; set; }

        [Column("razorpay_payment_id")]
        [StringLength(150)]
        public string? RazorpayPaymentId { get; set; }

        [Required]
        [Column("booking_id")]
        public long BookingId { get; set; }

        [Column("created_on")]
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        [Column("updated_on")]
        public DateTime UpdatedOn { get; set; } = DateTime.UtcNow;
    }
}
