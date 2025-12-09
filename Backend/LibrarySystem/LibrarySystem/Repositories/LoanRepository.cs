using AutoMapper;
using AutoMapper.QueryableExtensions;
using LibrarySystem.API.DataContext;
using LibrarySystem.API.Dtos.BookDtos;
using LibrarySystem.API.Dtos.LoanDtos;
using LibrarySystem.API.RepositoryInterfaces;
using LibrarySystem.Models.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LibrarySystem.API.Repositories
{
    public class LoanRepository : ILoanRepository
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        public LoanRepository(AppDbContext context, UserManager<AppUser> userManager,IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<Loan> AddLoanAsync(Loan loan)
        {
            var added = await _context.Loans.AddAsync(loan);
            await _context.SaveChangesAsync();

            var addedLoanWithDetails = await _context.Loans
                .Include(l => l.BookCopy)
                    .ThenInclude(bc => bc.Book)
                        .ThenInclude(b => b.BookAuthors)
                            .ThenInclude(ba => ba.Author)
                .Include(l => l.BookCopy.Shelf)
                    .ThenInclude(s => s.Room)
                .Include(l => l.AppUser)
                .FirstOrDefaultAsync(l => l.Id == loan.Id);

            return addedLoanWithDetails;
        }

        public async Task<bool> CanUserBarrowAsync(string userId)
        {
            return !await _context.Fines
                .AnyAsync(x => x.UserId == userId && x.IsActive == true);
        }

        public async Task<Loan?> MarkAsReturnedByBarcodeAsync(string barcode)
        {
            var loan = await _context.Loans
                .Include(l => l.BookCopy)
                .Include(l => l.BookCopy.Book)
                .Include(l => l.AppUser)
                .FirstOrDefaultAsync(l =>
                    l.BookCopy.BarcodeNumber == barcode &&
                    l.ActualReturnDate == null);

            if (loan == null)
            {
                return null;
            }

            loan.ActualReturnDate = DateTime.Now;
            loan.BookCopy.IsAvailable = true;

            await _context.SaveChangesAsync();

            return loan;
        }

        public async Task<Loan?> GetLoanByIdAsync(int id)
        {
            var loan = await _context.Loans
             .Include(l => l.BookCopy)
                 .ThenInclude(bc => bc.Book)
                     .ThenInclude(b => b.BookAuthors)
                         .ThenInclude(ba => ba.Author)
             .Include(l => l.AppUser)
             .Include(l => l.BookCopy.Shelf)
                 .ThenInclude(s => s.Room)
             .FirstOrDefaultAsync(l => l.Id == id);

            return loan;
        }

        public async Task<bool> IsBookCopyOnLoanAsync(int bookCopyId)
        {
            return await _context.Loans
                .AnyAsync(x => x.BookCopyId == bookCopyId && x.ActualReturnDate == null);
        }

        public async Task<Loan?> UpdateLoanAsync(Loan loan)
        {
            var updated  = _context.Loans.Update(loan);
            await _context.SaveChangesAsync();

            return await GetLoanByIdAsync(loan.Id);
        }

        public async Task<PaginatedLoanDto<LoanHistoryDto>> GetAllActiveLoansByUserAsync(string userId, int page, int pageSize)
        {
            var query = _context.Loans
                .AsNoTracking()
                .Where(l => l.UserId == userId && l.ActualReturnDate == null);

            var totalCount = await query.CountAsync();

            var loans = await query
                .Include(l => l.BookCopy)
                    .ThenInclude(bc => bc.Book)
                        .ThenInclude(b => b.BookAuthors)
                            .ThenInclude(ba => ba.Author)
                .Include(l => l.BookCopy.Shelf)
                    .ThenInclude(s => s.Room)
                .OrderByDescending(l => l.LoanDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(); 

            var items = _mapper.Map<List<LoanHistoryDto>>(loans);

            return new PaginatedLoanDto<LoanHistoryDto>(items, totalCount, page, pageSize);
        }

        public async Task<PaginatedLoanDto<LoanHistoryDto>> GetAllReturnedLoansByUserAsync(string userId, int page, int pageSize)
        {
            var query = _context.Loans
                .AsNoTracking()
                .Where(l => l.UserId == userId && l.ActualReturnDate != null);

            var totalCount = await query.CountAsync();

            var items = await query
                .Include(l => l.BookCopy)
                    .ThenInclude(bc => bc.Book)
                        .ThenInclude(b => b.BookAuthors)
                            .ThenInclude(ba => ba.Author)
                .Include(l => l.BookCopy.Shelf)
                    .ThenInclude(s => s.Room)
                .OrderByDescending(l => l.ActualReturnDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = _mapper.Map<List<LoanHistoryDto>>(items);

            return new PaginatedLoanDto<LoanHistoryDto>(dtos, totalCount, page, pageSize);
        }

        public async Task<int> GetLoanedBookCountAsync()
        {
            return await _context.Loans.CountAsync(l => l.ActualReturnDate == null);
        }

        public Task<int> GetOverdueLoanCountAsync()
        {
            return _context.Loans
                .CountAsync(l => l.ExpectedReturnDate < DateTime.Now && l.ActualReturnDate == null ||
                l.ActualReturnDate != null && l.ActualReturnDate > l.ExpectedReturnDate);
        }

        public async Task<PaginatedLoanDto<LoanWithUserDetailsDto>> GetAllLoansWithUserDetailAsync(int page, int pageSize)
        {
            var query = _context.Loans
                .AsNoTracking()
                .Where(l => l.ActualReturnDate == null);

            var totalCount = await query.CountAsync();

            var items = await query
                .Include(l => l.AppUser)
                .Include(l => l.BookCopy)
                    .ThenInclude(bc => bc.Book)
                        .ThenInclude(b => b.BookAuthors)
                            .ThenInclude(ba => ba.Author)
                .Include(l => l.BookCopy)
                    .ThenInclude(bc => bc.Shelf)
                        .ThenInclude(s => s.Room)
                .OrderByDescending(l => l.LoanDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = _mapper.Map<List<LoanWithUserDetailsDto>>(items);

            return new PaginatedLoanDto<LoanWithUserDetailsDto>(dtos, totalCount, page, pageSize);
        }

        public async Task<PaginatedLoanDto<LoanWithUserDetailsDto>> GetAllOverdueLoansWithUserDetailAsync(int page, int pageSize)
        {
            var today = DateTime.Now;

            var query = _context.Loans
                .AsNoTracking()
                .Where(l =>
                    (l.ActualReturnDate == null && l.ExpectedReturnDate < today) ||
                    (l.ActualReturnDate != null && l.ActualReturnDate > l.ExpectedReturnDate)
                );

            var totalCount = await query.CountAsync();

            var items = await query
                .Include(l => l.AppUser)
                .Include(l => l.BookCopy)
                    .ThenInclude(bc => bc.Book)
                        .ThenInclude(b => b.BookAuthors)
                            .ThenInclude(ba => ba.Author)
                .Include(l => l.BookCopy.Shelf)
                    .ThenInclude(s => s.Room)
                .OrderByDescending(l => l.ExpectedReturnDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = _mapper.Map<List<LoanWithUserDetailsDto>>(items);

            return new PaginatedLoanDto<LoanWithUserDetailsDto>(dtos, totalCount, page, pageSize);
        }

        public async Task<PaginatedLoanDto<LoanWithUserDetailsDto>> GetAllReturnedLoansWithUserDetailAsync(int page, int pageSize)
        {
            var query = _context.Loans
                .AsNoTracking()
                .Where(l => l.ActualReturnDate != null);

            var totalCount = await query.CountAsync();

            var items = await query
                .Include(l => l.AppUser)
                .Include(l => l.BookCopy)
                    .ThenInclude(bc => bc.Book)
                        .ThenInclude(b => b.BookAuthors)
                            .ThenInclude(ba => ba.Author)
                .Include(l => l.BookCopy.Shelf)
                    .ThenInclude(s => s.Room)
                .OrderByDescending(l => l.ActualReturnDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = _mapper.Map<List<LoanWithUserDetailsDto>>(items);

            return new PaginatedLoanDto<LoanWithUserDetailsDto>(dtos, totalCount, page, pageSize);
        }

        public async Task<Loan?> GetActiveLoanByBarcodeAsync(string barcode)
        {
            return await _context.Loans
                .Include(l => l.BookCopy)
                .Include(l => l.BookCopy.Book)
                .Include(l => l.AppUser)
                .FirstOrDefaultAsync(l =>
                    l.BookCopy.BarcodeNumber == barcode &&
                    l.ActualReturnDate == null);
        }

        public async Task<int> GetActiveLoanCountByUser(string userId)
        {
            return await _context.Loans
                .Where(x => x.UserId == userId && x.ActualReturnDate == null)
                .CountAsync();
        }

        public async Task<bool> HasActiveLoansByBook(int bookId)
        {
            return await _context.Loans
                .AnyAsync(x => x.BookCopy.BookId == bookId && x.ActualReturnDate == null);
        }

        public async Task<bool> HasActiveLoansByBookCopy(int bookCopyId)
        {
            return await _context.Loans
                .AnyAsync(x => x.BookCopyId == bookCopyId && x.ActualReturnDate == null);
        }

        public async Task<bool> HasActiveLoansByCategory(int categoryId)
        {
            return await _context.Loans
                .AnyAsync(x => x.BookCopy.Book.CategoryId == categoryId && x.ActualReturnDate == null);
        }

        public async Task<bool> HasActiveLoansByPublisher(int publisherId)
        {
            return await _context.Loans
                .AnyAsync(x => x.BookCopy.Book.PublisherId == publisherId && x.ActualReturnDate == null);
        }

        public async Task<bool> HasActiveLoansByAuthor(int authorId)
        {
            return await _context.Loans
                .AnyAsync(x =>
                    x.BookCopy.Book.BookAuthors.Any(ba => ba.AuthorId == authorId) &&
                    x.ActualReturnDate == null
                );
        }
    }
}
