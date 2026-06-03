using Blind_Blind_Backend.Entities.DataGames;

namespace Blind_Blind_Backend.Repositories.DataGames
{
    public interface IGameManagementRepository
    {
        Task<List<Game>> GetAllAsync();
        Task<Game?> GetByIdAsync(int id);
        Task<Game> CreateAsync(Game game);
        Task<Game?> UpdateAsync(Game game);
        Task<bool> DeleteAsync(int id);
    }
}
