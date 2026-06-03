using Blind_Blind_Backend.DTOs.DataGames;
using Blind_Blind_Backend.Entities.DataGames;
using Blind_Blind_Backend.Repositories.DataGames;
using Blind_Blind_Backend.Services.Interfaces;

namespace Blind_Blind_Backend.Services
{
    public class GameManagementService : IGameManagementService
    {
        private readonly IGameManagementRepository _repo;

        public GameManagementService(IGameManagementRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<GameDTO>> GetAllAsync()
        {
            var games = await _repo.GetAllAsync();
            return games.Select(MapToDTO).ToList();
        }

        public async Task<GameDTO?> GetByIdAsync(int id)
        {
            var game = await _repo.GetByIdAsync(id);
            return game == null ? null : MapToDTO(game);
        }

        public async Task<GameDTO> CreateAsync(GameCreateDTO dto)
        {
            var entity = new Game
            {
                Name = dto.Name,
                Description = dto.Description,
                Image_Game = dto.Image_Game != null ? await ToBytes(dto.Image_Game) : null
            };

            var created = await _repo.CreateAsync(entity);
            return MapToDTO(created);
        }

        public async Task<GameDTO?> UpdateAsync(int id, GameUpdateDTO dto)
        {
            var entity = new Game
            {
                Id_Game = id,
                Name = dto.Name,
                Description = dto.Description,
                Image_Game = dto.Image_Game != null ? await ToBytes(dto.Image_Game) : null
            };

            var updated = await _repo.UpdateAsync(entity);

            return updated == null ? null : MapToDTO(updated);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repo.DeleteAsync(id);
        }

        private async Task<byte[]> ToBytes(IFormFile file)
        {
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            return ms.ToArray();
        }

        private GameDTO MapToDTO(Game game)
        {
            return new GameDTO
            {
                Id_Game = game.Id_Game,
                Name = game.Name,
                Description = game.Description,
                Image_Game = game.Image_Game != null
                    ? Convert.ToBase64String(game.Image_Game)
                    : null
            };
        }
    }
}