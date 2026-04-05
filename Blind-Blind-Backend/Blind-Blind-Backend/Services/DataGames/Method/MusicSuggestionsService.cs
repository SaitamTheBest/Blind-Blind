using Blind_Blind_Backend.DTOs.DataGames;
using Blind_Blind_Backend.Entities.DataGames;
using Blind_Blind_Backend.Repositories.DataGames;

namespace Blind_Blind_Backend.Services.DataGames.Method
{
    public class MusicSuggestionsService : IMusicSuggestionsService
    {
        private readonly IMusicSuggestionsRepository _repository;

        public MusicSuggestionsService(IMusicSuggestionsRepository repository)
        {
            _repository = repository;
        }

        public async Task<MusicSuggestionDTO> CreateSuggestionAsync(string userId, MusicSuggestionCreateDTO dto)
        {
            var suggestion = new Music_Suggestions
            {
                Id_User = userId,
                Title = dto.Title,
                Artist_Name = dto.Artist_Name,
                Message = dto.Message,
                Status = "Pending",
                Created_At = DateTime.UtcNow,
                Updated_At = DateTime.UtcNow
            };

            await _repository.CreateAsync(suggestion);

            return new MusicSuggestionDTO
            {
                Id_Suggestion = suggestion.Id_Suggestion,
                Title = suggestion.Title,
                Artist_Name = suggestion.Artist_Name,
                Message = suggestion.Message,
                Status = suggestion.Status,
                Created_At = suggestion.Created_At
            };
        }

        public async Task<IEnumerable<MusicSuggestionAdminDTO>> GetAllSuggestionsAdminAsync()
        {
            var suggestions = await _repository.GetAllAsync();
            return suggestions.Select(s => new MusicSuggestionAdminDTO
            {
                Id_Suggestion = s.Id_Suggestion,
                Title = s.Title,
                Artist_Name = s.Artist_Name,
                Message = s.Message,
                Status = s.Status,
                Created_At = s.Created_At,
                ProposedBy = s.User != null ? s.User.Username : s.Id_User
            });
        }

        public async Task<MusicSuggestionDTO?> GetUserSuggestionAsync(int id, string userId)
        {
            var suggestion = await _repository.GetByIdAsync(id);
            if (suggestion == null || suggestion.Id_User != userId)
            {
                return null;
            }

            return new MusicSuggestionDTO
            {
                Id_Suggestion = suggestion.Id_Suggestion,
                Title = suggestion.Title,
                Artist_Name = suggestion.Artist_Name,
                Message = suggestion.Message,
                Status = suggestion.Status,
                Created_At = suggestion.Created_At
            };
        }

        public async Task AcceptSuggestionAsync(int id, string adminId)
        {
            var suggestion = await _repository.GetByIdAsync(id);
            if (suggestion == null) throw new ArgumentException("Suggestion introuvable.");

            suggestion.Status = "Accepted";
            suggestion.Reviewed_By = adminId;
            suggestion.Reviewed_At = DateTime.UtcNow;
            suggestion.Updated_At = DateTime.UtcNow;

            await _repository.UpdateAsync(suggestion);
        }

        public async Task RejectSuggestionAsync(int id, string adminId)
        {
            var suggestion = await _repository.GetByIdAsync(id);
            if (suggestion == null) throw new ArgumentException("Suggestion introuvable.");

            suggestion.Status = "Rejected";
            suggestion.Reviewed_By = adminId;
            suggestion.Reviewed_At = DateTime.UtcNow;
            suggestion.Updated_At = DateTime.UtcNow;

            await _repository.UpdateAsync(suggestion);
        }
    }
}
