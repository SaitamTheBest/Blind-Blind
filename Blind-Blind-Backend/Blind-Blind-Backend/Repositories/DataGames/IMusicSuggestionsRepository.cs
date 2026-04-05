using Blind_Blind_Backend.Entities.DataGames;

namespace Blind_Blind_Backend.Repositories.DataGames
{
    public interface IMusicSuggestionsRepository
    {
        Task<Music_Suggestions> CreateAsync(Music_Suggestions suggestion);
        Task<Music_Suggestions?> GetByIdAsync(int id);
        Task<IEnumerable<Music_Suggestions>> GetAllAsync();
        Task UpdateAsync(Music_Suggestions suggestion);
    }
}
