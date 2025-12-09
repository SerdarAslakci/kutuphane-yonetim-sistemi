using LibrarySystem.API.Dtos.BookCommentDtos;
using LibrarySystem.Models.Models;

namespace LibrarySystem.API.RepositoryInterfaces
{
    public interface IBookCommentRepository
    {
        Task<PaginatedBookCommentResult<BookCommentDto>> GetBookCommentsByBookIdAsync(int bookId, int page, int pageSize);
        Task<BookComment> AddBookCommentAsync(BookComment comment);
        Task<bool> DeleteBookCommentAsync(int commentId);
        Task<BookComment?> GetBookCommentByIdAsync(int commentId);
    }
}
