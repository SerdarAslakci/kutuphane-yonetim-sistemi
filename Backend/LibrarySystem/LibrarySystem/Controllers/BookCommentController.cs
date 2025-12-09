using LibrarySystem.API.Dtos.BookCommentDtos;
using LibrarySystem.API.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LibrarySystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookCommentController : ControllerBase
    {
        private readonly IBookCommentService _bookCommentService;
        private readonly ILogger<BookCommentController> _logger;

        public BookCommentController(IBookCommentService bookCommentService, ILogger<BookCommentController> logger)
        {
            _bookCommentService = bookCommentService;
            _logger = logger;
        }

        [HttpGet("get-comments")]
        public async Task<IActionResult> GetComments([FromQuery] BookCommentsPageableDto dto)
        {
            try
            {
                var result = await _bookCommentService.GetBookCommentsByBookIdAsync(dto);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorumlar getirilirken beklenmedik bir hata oluştu. BookId: {BookId}", dto.BookId);
                return StatusCode(500, "Sunucu hatası: Yorumlar yüklenemedi.");
            }
        }

        [HttpPost("add-comment")]
        [Authorize]
        public async Task<IActionResult> AddComment([FromBody] AddBookCommentDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized("Kullanıcı kimliği doğrulanamadı.");

                var result = await _bookCommentService.AddBookCommentAsync(userId, dto);

                return Ok(result);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message );
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return BadRequest(ex.Message );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorum eklenirken hata oluştu.");
                return StatusCode(500,"Yorum eklenirken bir sunucu hatası oluştu." );
            }
        }

        [HttpDelete("delete-comment/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized("Kullanıcı kimliği doğrulanamadı.");

                var isDeleted = await _bookCommentService.DeleteBookCommentAsync(id);

                if (isDeleted)
                    return Ok("Yorum başarıyla silindi.");
                else
                    return BadRequest("Silme işlemi başarısız oldu.");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorum silinirken hata oluştu. CommentId: {Id}", id);
                return StatusCode(500, "Silme işlemi sırasında sunucu hatası oluştu.");
            }
        }
    }
}
