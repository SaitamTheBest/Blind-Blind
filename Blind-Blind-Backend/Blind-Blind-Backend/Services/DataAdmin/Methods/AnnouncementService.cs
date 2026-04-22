using Blind_Blind_Backend.DTOs.DataAdmin;
using Blind_Blind_Backend.Entities.DataAdmin;
using Blind_Blind_Backend.Repositories.DataAdmin;
using Microsoft.AspNetCore.Http;

namespace Blind_Blind_Backend.Services.DataAdmin
{
    public class AnnouncementService : IAnnouncementService
    {
        private readonly IAnnouncementRepository _repository;

        public AnnouncementService(IAnnouncementRepository repository)
        {
            _repository = repository;
        }

        private async Task<byte[]?> ConvertFormFileToBytes(IFormFile? file)
        {
            if (file == null || file.Length == 0)
                return null;

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }

        public async Task<IReadOnlyList<AnnouncementDTO>> GetAllAsync()
        {
            var announcements = await _repository.GetAllAsync();
            return announcements.Select(MapToDTO).ToList();
        }

        public async Task<AnnouncementDTO?> GetByIdAsync(int id)
        {
            var announcement = await _repository.GetByIdAsync(id);
            return announcement == null ? null : MapToDTO(announcement);
        }

        public async Task<AnnouncementDTO> CreateAsync(AnnouncementCreateDTO announcementCreateDTO, string authorId)
        {
            byte[]? coverImageBytes = await ConvertFormFileToBytes(announcementCreateDTO.Cover_Image);

            var announcement = new Announcement
            {
                Title = announcementCreateDTO.Title,
                Short_Description = announcementCreateDTO.Short_Description,
                Cover_Image = coverImageBytes,
                Content = announcementCreateDTO.Content,
                Publication_Date = announcementCreateDTO.Publication_Date,
                Created_At = DateTime.UtcNow,
                Id_Announcement_Type = announcementCreateDTO.Id_Announcement_Type,
                Id_Author = authorId,
                Is_Published = announcementCreateDTO.Is_Published,
                Slug = announcementCreateDTO.Slug
            };

            await _repository.AddAsync(announcement);

            // Reload with relationships for DTO mapping
            var createdAnnouncement = await _repository.GetByIdAsync(announcement.Id_Announcement);
            return MapToDTO(createdAnnouncement);
        }

        public async Task<AnnouncementDTO> UpdateAsync(int id, AnnouncementUpdateDTO announcementUpdateDTO)
        {
            var announcement = await _repository.GetByIdAsync(id);
            if (announcement == null)
            {
                throw new KeyNotFoundException($"Announcement with ID {id} not found");
            }

            announcement.Title = announcementUpdateDTO.Title;
            announcement.Short_Description = announcementUpdateDTO.Short_Description;
            announcement.Content = announcementUpdateDTO.Content;
            announcement.Publication_Date = announcementUpdateDTO.Publication_Date;
            announcement.Id_Announcement_Type = announcementUpdateDTO.Id_Announcement_Type;
            announcement.Is_Published = announcementUpdateDTO.Is_Published;
            announcement.Slug = announcementUpdateDTO.Slug;

            if (announcementUpdateDTO.Cover_Image != null)
            {
                announcement.Cover_Image = await ConvertFormFileToBytes(announcementUpdateDTO.Cover_Image);
            }

            await _repository.UpdateAsync(announcement);

            // Reload with relationships for DTO mapping
            var updatedAnnouncement = await _repository.GetByIdAsync(id);
            return MapToDTO(updatedAnnouncement);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        private AnnouncementDTO MapToDTO(Announcement announcement)
        {
            return new AnnouncementDTO
            {
                Id_Announcement = announcement.Id_Announcement,
                Title = announcement.Title,
                Short_Description = announcement.Short_Description,
                Cover_Image = announcement.Cover_Image != null ? Convert.ToBase64String(announcement.Cover_Image) : null,
                Content = announcement.Content,
                Publication_Date = announcement.Publication_Date,
                Created_At = announcement.Created_At,
                Updated_At = announcement.Updated_At,
                Id_Announcement_Type = announcement.Id_Announcement_Type,
                Id_Author = announcement.Id_Author,
                Is_Published = announcement.Is_Published,
                Slug = announcement.Slug,
                Announcement_Type = announcement.Announcement_Type == null ? null : new Announcement_TypeDTO
                {
                    Id_Announcement_Type = announcement.Announcement_Type.Id_Announcement_Type,
                    Label = announcement.Announcement_Type.Label,
                    Is_Important = announcement.Announcement_Type.Is_Important
                },
                Author_Name = announcement.Author?.Username ?? "Unknown"
            };
        }
    }
}
