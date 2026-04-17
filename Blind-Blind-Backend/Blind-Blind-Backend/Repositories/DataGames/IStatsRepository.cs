namespace Blind_Blind_Backend.Repositories.DataGames
{
    public interface IStatsRepository
    {
        Task<int> GetTotalAlbumsAsync();
        Task<int> GetTotalArtistsAsync();
        Task<int> GetTotalTracksAsync();
        Task<int> GetTotalGamesDayAsync();
    }
}
