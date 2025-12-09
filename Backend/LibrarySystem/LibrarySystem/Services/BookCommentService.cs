using LibrarySystem.API.Dtos.BookCommentDtos;
using LibrarySystem.API.RepositoryInterfaces;
using LibrarySystem.API.ServiceInterfaces;
using LibrarySystem.Models.Models;
using Microsoft.Extensions.Logging;

namespace LibrarySystem.API.Services
{
    public class BookCommentService : IBookCommentService
    {
        private readonly IBookCommentRepository _bookCommentRepository;
        private readonly ILogger<BookCommentService> _logger;

        public BookCommentService(IBookCommentRepository bookCommentRepository, ILogger<BookCommentService> logger)
        {
            _bookCommentRepository = bookCommentRepository;
            _logger = logger;
        }

        public async Task<BookComment> AddBookCommentAsync(string userId, AddBookCommentDto commentDto)
        {
            _logger.LogInformation("AddBookCommentAsync metodu tetiklendi. User: {UserId}, BookId: {BookId}", userId, commentDto.bookId);

            if (commentDto == null)
            {
                _logger.LogError("Hata: Gönderilen comment verisi boş (null).");
                throw new ArgumentNullException(nameof(commentDto), "Yorum verisi boş olamaz.");
            }

            if (commentDto.rating < 1 || commentDto.rating > 5)
            {
                _logger.LogWarning("Geçersiz puanlama denemesi: {Rating}", commentDto.rating);
                throw new ArgumentOutOfRangeException(nameof(commentDto.rating), "Puan 1 ile 5 arasında olmalıdır.");
            }

            var newComment = new BookComment
            {
                BookId = commentDto.bookId,
                CommentText = commentDto.content,
                Rating = commentDto.rating,
                userId = userId, 
                CreatedDate = DateTime.Now,
            };

            await _bookCommentRepository.AddBookCommentAsync(newComment);

            _logger.LogInformation("Yorum başarıyla veritabanına eklendi. CommentId: {Id}", newComment.Id);

            return newComment;
        }

        public async Task<bool> DeleteBookCommentAsync(int commentId)
        {
            _logger.LogInformation("DeleteBookCommentAsync metodu tetiklendi. CommentId: {Id}", commentId);

            var existingComment = await _bookCommentRepository.GetBookCommentByIdAsync(commentId);

            if (existingComment == null)
            {
                _logger.LogError("Silinmek istenen yorum bulunamadı. ID: {Id}", commentId);
                throw new KeyNotFoundException($"ID'si {commentId} olan yorum bulunamadı.");
            }

            await _bookCommentRepository.DeleteBookCommentAsync(commentId);

            _logger.LogInformation("Yorum başarıyla silindi. ID: {Id}", commentId);

            return true;
        }

        public async Task<PaginatedBookCommentResult<BookCommentDto>> GetBookCommentsByBookIdAsync(BookCommentsPageableDto dto)
        {
            _logger.LogInformation("GetBookCommentsByBookIdAsync çalıştı. BookId: {BookId}, Page: {Page}", dto.BookId, dto.page);

            if (dto.page <= 0 || dto.pageSize <= 0)
            {
                _logger.LogError("Geçersiz sayfalama parametreleri. Page: {Page}, Size: {Size}", dto.page, dto.pageSize);
                throw new ArgumentException("Sayfa numarası ve boyutu 0'dan büyük olmalıdır.");
            }

            var comments = await _bookCommentRepository.GetBookCommentsByBookIdAsync(dto.BookId, dto.page, dto.pageSize);

            if (comments == null)
            {
                throw new InvalidOperationException("Veritabanından yorumlar çekilemedi.");
            }

            return comments;
        }
    }
}