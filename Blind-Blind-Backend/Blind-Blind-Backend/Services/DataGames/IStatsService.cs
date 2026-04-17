using Blind_Blind_Backend.DTOs.DataGames;

namespace Blind_Blind_Backend.Services.DataGames
{
    public interface IStatsService
    {
        Task<MusicDataStatsDTO> GetStatsAsync();
    }
}
