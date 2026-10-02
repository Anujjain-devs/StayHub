using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StayHub.PaymentService.DTOs;
using StayHub.PaymentService.Services;

namespace StayHub.PaymentService.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        /// <summary>
        /// Create a Razorpay Payment Order for a given Booking
        /// </summary>
        [HttpPost("create-order")]
        [ProducesResponseType(typeof(PaymentResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PaymentResponseDto>> CreateOrder([FromBody] PaymentRequestDto dto)
        {
            string? bearerToken = Request.Headers["Authorization"].ToString();
            var response = await _paymentService.CreateOrderAsync(dto, bearerToken);
            return CreatedAtAction(nameof(GetPaymentById), new { id = response.Id }, response);
        }

        /// <summary>
        /// Verify Razorpay Payment Signature
        /// </summary>
        [HttpPost("verify")]
        [ProducesResponseType(typeof(PaymentResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PaymentResponseDto>> VerifyPayment([FromBody] PaymentVerifyRequestDto dto)
        {
            string? bearerToken = Request.Headers["Authorization"].ToString();
            var response = await _paymentService.VerifyPaymentAsync(dto, bearerToken);
            return Ok(response);
        }

        /// <summary>
        /// Get all payments
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<PaymentResponseDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<PaymentResponseDto>>> GetAllPayments()
        {
            var payments = await _paymentService.GetAllPaymentsAsync();
            return Ok(payments);
        }

        /// <summary>
        /// Get payment by ID
        /// </summary>
        [HttpGet("{id:long}")]
        [ProducesResponseType(typeof(PaymentResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PaymentResponseDto>> GetPaymentById(long id)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(id);
            return Ok(payment);
        }

        /// <summary>
        /// Get payment by Booking ID
        /// </summary>
        [HttpGet("booking/{bookingId:long}")]
        [ProducesResponseType(typeof(PaymentResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PaymentResponseDto>> GetPaymentByBookingId(long bookingId)
        {
            var payment = await _paymentService.GetPaymentByBookingIdAsync(bookingId);
            return Ok(payment);
        }

        /// <summary>
        /// Delete payment record
        /// </summary>
        [HttpDelete("{id:long}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeletePayment(long id)
        {
            await _paymentService.DeletePaymentAsync(id);
            return NoContent();
        }
    }
}
