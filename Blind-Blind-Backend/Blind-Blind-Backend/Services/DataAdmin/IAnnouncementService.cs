using Blind_Blind_Backend.DTOs.DataAdmin;

namespace Blind_Blind_Backend.Services.DataAdmin
{
    public interface IAnnouncementService
    {
        Task<IReadOnlyList<AnnouncementDTO>> GetAllAsync();
        Task<AnnouncementDTO?> GetByIdAsync(int id);
        Task<AnnouncementDTO> CreateAsync(AnnouncementCreateDTO announcementCreateDTO, string authorId);
        Task<AnnouncementDTO> UpdateAsync(int id, AnnouncementUpdateDTO announcementUpdateDTO);
        Task DeleteAsync(int id);
    }
}
