using Blind_Blind_Backend.DTOs.DataGames;

namespace Blind_Blind_Backend.Services.Interfaces
{
    public interface IGameManagementService
    {
        Task<List<GameDTO>> GetAllAsync();
        Task<GameDTO?> GetByIdAsync(int id);

        Task<GameDTO> CreateAsync(GameCreateDTO dto);
        Task<GameDTO?> UpdateAsync(int id, GameUpdateDTO dto);

        Task<bool> DeleteAsync(int id);
    }
}