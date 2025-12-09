using AutoMapper;
using AutoMapper.QueryableExtensions;
using LibrarySystem.API.DataContext;
using LibrarySystem.API.Dtos.BookCommentDtos;
using LibrarySystem.API.RepositoryInterfaces;
using LibrarySystem.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace LibrarySystem.API.Repositories
{
    public class BookCommentRepository : IBookCommentRepository
    {

        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public BookCommentRepository(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<BookComment> AddBookCommentAsync(BookComment comment)
        {
            var result = await _context.BookComments.AddAsync(comment);

            await _context.SaveChangesAsync();

            return result.Entity;
        }

        public async Task<bool> DeleteBookCommentAsync(int commentId)
        {
            var comment = await _context.BookComments.FindAsync(commentId);

            if (comment == null)
            {
                return false;
            }

            _context.BookComments.Remove(comment);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<BookComment?> GetBookCommentByIdAsync(int commentId)
        {
            return await _context.BookComments.FindAsync(commentId);
        }

        public async Task<PaginatedBookCommentResult<BookCommentDto>> GetBookCommentsByBookIdAsync(int bookId, int page, int pageSize)
        {
            var query = _context.BookComments
                .Where(bc => bc.BookId == bookId)
                .OrderByDescending(bc => bc.CreatedDate);

            var totalCount = await query.CountAsync();

            var comments = await query
                .ProjectTo<BookCommentDto>(_mapper.ConfigurationProvider) // Mapper burada devreye girer
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedBookCommentResult<BookCommentDto>
            (
                comments,
                totalCount,
                page,
                pageSize
            );
        }


    }
}
