using LibrarySystem.API.Dtos.AuthorDtos;
using LibrarySystem.API.Dtos.BookDtos;
using LibrarySystem.API.Dtos.LoanDtos;
using LibrarySystem.Models.Models;

namespace LibrarySystem.API.RepositoryInterfaces
{
    public interface ILoanRepository
    {
        Task<Loan> AddLoanAsync(Loan loan);
        Task<Loan?> UpdateLoanAsync(Loan loan);
        Task<Loan?> GetLoanByIdAsync(int id);
        Task<Loan?> GetActiveLoanByBarcodeAsync(string barcode);
        Task<int> GetActiveLoanCountByUser(string userId);
        Task<bool> HasActiveLoansByBook(int bookId);
        Task<bool> HasActiveLoansByBookCopy(int bookCopyId);
        Task<bool> HasActiveLoansByCategory(int categoryId);
        Task<bool> HasActiveLoansByPublisher(int publisherId);
        Task<bool> HasActiveLoansByAuthor(int authorId);

        //For admin panel
        Task<PaginatedLoanDto<LoanWithUserDetailsDto>> GetAllLoansWithUserDetailAsync(int page, int pageSize);
        Task<PaginatedLoanDto<LoanWithUserDetailsDto>> GetAllOverdueLoansWithUserDetailAsync(int page, int pageSize);
        Task<PaginatedLoanDto<LoanWithUserDetailsDto>> GetAllReturnedLoansWithUserDetailAsync(int page, int pageSize);

        Task<PaginatedLoanDto<LoanHistoryDto>?> GetAllActiveLoansByUserAsync(string userId, int page, int pageSize);
        Task<PaginatedLoanDto<LoanHistoryDto>?> GetAllReturnedLoansByUserAsync(string userId, int page, int pageSize);
        Task<bool> IsBookCopyOnLoanAsync(int bookCopyId);
        Task<bool> CanUserBarrowAsync(string userId);
        Task<Loan?> MarkAsReturnedByBarcodeAsync(string barcode);
        Task<int> GetLoanedBookCountAsync();
        Task<int> GetOverdueLoanCountAsync();
    }
}
