using Blind_Blind_Backend.DTOs.DataGames;

namespace Blind_Blind_Backend.Services.DataGames
{
    public interface IMusicSuggestionsService
    {
        Task<MusicSuggestionDTO> CreateSuggestionAsync(string userId, MusicSuggestionCreateDTO dto);
        Task<IEnumerable<MusicSuggestionDTO>> GetUserSuggestionsAsync(string userId);
        Task<IEnumerable<MusicSuggestionAdminDTO>> GetAllSuggestionsAdminAsync();
        Task AcceptSuggestionAsync(int id, string adminId);
        Task RejectSuggestionAsync(int id, string adminId);
    }
}
