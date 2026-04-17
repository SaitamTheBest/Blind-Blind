using Blind_Blind_Backend.Entities.DataAdmin;

namespace Blind_Blind_Backend.Repositories.DataAdmin
{
    public interface IAnnouncementRepository
    {
        Task<IReadOnlyList<Announcement>> GetAllAsync();
        Task<Announcement?> GetByIdAsync(int id);
        Task AddAsync(Announcement announcement);
        Task UpdateAsync(Announcement announcement);
        Task DeleteAsync(int id);
    }
}
