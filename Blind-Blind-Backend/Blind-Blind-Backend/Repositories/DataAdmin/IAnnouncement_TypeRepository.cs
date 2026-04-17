using Blind_Blind_Backend.Entities.DataAdmin;

namespace Blind_Blind_Backend.Repositories.DataAdmin
{
    public interface IAnnouncement_TypeRepository
    {
        Task<IReadOnlyList<Announcement_Type>> GetAllAsync();
        Task<Announcement_Type?> GetByIdAsync(int id);
        Task AddAsync(Announcement_Type announcementType);
        Task UpdateAsync(Announcement_Type announcementType);
    }
}
