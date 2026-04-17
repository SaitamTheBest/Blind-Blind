using Blind_Blind_Backend.DTOs.DataAdmin;
using Blind_Blind_Backend.Entities.DataAdmin;
using Blind_Blind_Backend.Repositories.DataAdmin;

namespace Blind_Blind_Backend.Services.DataAdmin
{
    public class Announcement_TypeService : IAnnouncement_TypeService
    {
        private readonly IAnnouncement_TypeRepository _repository;

        public Announcement_TypeService(IAnnouncement_TypeRepository repository)
        {
            _repository = repository;
        }

        public async Task<IReadOnlyList<Announcement_TypeDTO>> GetAllAsync()
        {
            var announcementTypes = await _repository.GetAllAsync();
            return announcementTypes.Select(MapToDTO).ToList();
        }

        public async Task<Announcement_TypeDTO?> GetByIdAsync(int id)
        {
            var announcementType = await _repository.GetByIdAsync(id);
            return announcementType == null ? null : MapToDTO(announcementType);
        }

        public async Task<Announcement_TypeDTO> CreateAsync(Announcement_TypeCreateDTO announcementTypeCreateDTO)
        {
            var announcementType = new Announcement_Type
            {
                Label = announcementTypeCreateDTO.Label,
                Is_Important = announcementTypeCreateDTO.Is_Important
            };

            await _repository.AddAsync(announcementType);
            
            // Reload to get the generated ID
            var createdAnnouncementType = await _repository.GetByIdAsync(announcementType.Id_Announcement_Type);
            return MapToDTO(createdAnnouncementType);
        }

        public async Task<Announcement_TypeDTO> UpdateAsync(int id, Announcement_TypeUpdateDTO announcementTypeUpdateDTO)
        {
            var announcementType = await _repository.GetByIdAsync(id);
            if (announcementType == null)
            {
                throw new KeyNotFoundException($"Announcement type with ID {id} not found");
            }

            announcementType.Label = announcementTypeUpdateDTO.Label;
            announcementType.Is_Important = announcementTypeUpdateDTO.Is_Important;

            await _repository.UpdateAsync(announcementType);
            
            // Reload to ensure fresh data
            var updatedAnnouncementType = await _repository.GetByIdAsync(id);
            return MapToDTO(updatedAnnouncementType);
        }

        private Announcement_TypeDTO MapToDTO(Announcement_Type announcementType)
        {
            return new Announcement_TypeDTO
            {
                Id_Announcement_Type = announcementType.Id_Announcement_Type,
                Label = announcementType.Label,
                Is_Important = announcementType.Is_Important
            };
        }
    }
}
