using Blind_Blind_Backend.DTOs.DataAdmin;

namespace Blind_Blind_Backend.Services.DataAdmin
{
    public interface IAnnouncement_TypeService
    {
        Task<IReadOnlyList<Announcement_TypeDTO>> GetAllAsync();
        Task<Announcement_TypeDTO?> GetByIdAsync(int id);
        Task<Announcement_TypeDTO> CreateAsync(Announcement_TypeCreateDTO announcementTypeCreateDTO);
        Task<Announcement_TypeDTO> UpdateAsync(int id, Announcement_TypeUpdateDTO announcementTypeUpdateDTO);
    }
}
