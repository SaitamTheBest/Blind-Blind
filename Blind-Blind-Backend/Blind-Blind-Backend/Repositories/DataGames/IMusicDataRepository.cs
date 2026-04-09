using Blind_Blind_Backend.Entities.DataGames;

namespace Blind_Blind_Backend.Repositories.DataGames
{
    public interface IMusicDataRepository
    {
        #region GET
        Task<List<Tracks>> GetAllTracks();
        Task<List<Artists>> GetAllArtists();
        Task<List<Album>> GetAllAlbum();
        Task<Tracks?> GetTrackById(string id);
        Task<Artists?> GetArtistById(string id);
        Task<Album?> GetAlbumById(string id);
        Task<List<Genre_Tracks>> GetAllGenres();
        Task<Genre_Tracks?> GetGenreById(int id);
        Task<List<Type_Artists>> GetAllTypeArtists();
        Task<Type_Artists?> GetTypeArtistById(int id);
        Task<List<Lyrics>> GetAllLyrics();
        Task<Lyrics?> GetLyricsById(string id);
        #endregion

        #region CREATE
        Task CreateTrack(Tracks track);
        Task CreateAlbum(Album album);
        Task CreateArtist(Artists artist);
        Task AddFeaturings(IEnumerable<Featurings> featurings);
        Task CreateGenre(Genre_Tracks genre);
        Task CreateTypeArtist(Type_Artists typeArtist);
        Task CreateLyrics(Lyrics lyrics);
        #endregion

        #region UPDATE
        Task UpdateTrack(Tracks track);
        Task UpdateAlbum(Album album);
        Task UpdateArtist(Artists artist);
        Task UpdateGenre(Genre_Tracks genre);
        Task UpdateTypeArtist(Type_Artists typeArtist);
        Task UpdateLyrics(Lyrics lyrics);
        #endregion

        #region DELETE
        Task DeleteTrack(string id);
        Task DeleteAlbum(string id);
        Task DeleteArtist(string id);
        Task DeleteFeaturingsByTrackAsync(string id_track);
        Task DeleteGenre(int id);
        Task DeleteTypeArtist(int id);
        Task DeleteLyrics(string id);
        #endregion
    }
}
