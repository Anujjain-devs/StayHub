using Microsoft.EntityFrameworkCore;
using StayHub.PaymentService.Models;

namespace StayHub.PaymentService.Data
{
    public class PaymentDbContext : DbContext
    {
        public PaymentDbContext(DbContextOptions<PaymentDbContext> options) : base(options)
        {
        }

        public DbSet<Payment> Payments { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.ToTable("payments");

                entity.HasKey(e => e.Id);

                // Store Enums as String to match Java Hibernate @Enumerated(EnumType.STRING)
                entity.Property(e => e.Status)
                      .HasConversion<string>()
                      .HasColumnName("status");

                entity.Property(e => e.PaymentMethod)
                      .HasConversion<string>()
                      .HasColumnName("payment_method");

                entity.Property(e => e.PaymentDate)
                      .HasColumnName("payment_date");

                entity.Property(e => e.BookingId)
                      .HasColumnName("booking_id");
            });
        }
    }
}
