using LibrarySystem.API.Dtos.FineDtos;
using LibrarySystem.API.Dtos.UserDtos;
using LibrarySystem.Models.Models;

namespace LibrarySystem.API.RepositoryInterfaces
{
    public interface IFineRepository
    {
        Task<Fine?> GetFineByIdAsync(int id);
        Task<PaginatedFineResult<UserFineDto>> GetActiveFinesByUserIdAsync(string userId, int page, int pageSize);
        Task<PaginatedFineResult<UserFineDto>> GetInActiveFinesByUserIdAsync(string userId, int page, int pageSize);
        Task<Fine?> ProcessLateReturnAsync(Loan loan);
        Task<IEnumerable<Fine>> GetUserFinesWithLoanAsync(string userId);
        Task<Fine?> RevokeFineByIdAscyn(int id);
        Task<Fine> AddFineAsync(Fine fine);
    }
}
