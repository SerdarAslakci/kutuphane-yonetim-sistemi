using LibrarySystem.API.Dtos.BookCommentDtos;
using LibrarySystem.Models.Models;

namespace LibrarySystem.API.ServiceInterfaces
{
    public interface IBookCommentService
    {

        Task<PaginatedBookCommentResult<BookCommentDto>> GetBookCommentsByBookIdAsync(BookCommentsPageableDto dto);
        Task<BookComment> AddBookCommentAsync(string userId, AddBookCommentDto comment);
        Task<bool> DeleteBookCommentAsync(int commentId);
    }
}
