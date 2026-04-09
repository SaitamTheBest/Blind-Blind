using Blind_Blind_Backend.DTOs.DataGames;

namespace Blind_Blind_Backend.Services.DataGames
{
    public interface IMusicDataService
    {
        #region GET
        Task<AlbumDTO?> GetAlbumById(string id);
        Task<List<AlbumDTO>> GetAllAlbums();
        Task<List<ArtistDTO>> GetAllArtists();
        Task<List<TrackDTO>> GetAllTracks();
        Task<ArtistDTO?> GetArtistById(string id);
        Task<TrackDTO?> GetTrackById(string id);
        Task<List<GenreDTO>> GetAllGenres();
        Task<GenreDTO?> GetGenreById(int id);
        Task<List<Type_ArtistsDTO>> GetAllTypeArtists();
        Task<Type_ArtistsDTO?> GetTypeArtistById(int id);
        Task<List<LyricsDTO>> GetAllLyrics();
        Task<LyricsDTO?> GetLyricsById(string id);
        #endregion

        #region CREATE
        Task CreateTrack(TrackCrudDTO trackCrudDTO);
        Task CreateAlbum(AlbumCrudDTO albumCrudDTO);
        Task CreateArtist(ArtistCrudDTO artistCrudDTO);
        Task AddFeaturingsToTrack(string trackId, List<string> artistIds);
        Task CreateGenre(GenreCrudDTO genreCrudDTO);
        Task CreateTypeArtist(Type_ArtistsCrudDTO typeArtistCrudDTO);
        Task CreateLyrics(LyricsCrudDTO lyricsCrudDTO);
        #endregion

        #region UPDATE
        Task UpdateTrack(TrackCrudDTO trackCrudDTO);
        Task UpdateAlbum(AlbumCrudDTO albumCrudDTO);
        Task UpdateArtist(ArtistCrudDTO artistCrudDTO);
        Task UpdateFeaturingsForTrack(string trackId, List<string> artistIds);
        Task UpdateGenre(GenreCrudDTO genreCrudDTO);
        Task UpdateTypeArtist(Type_ArtistsCrudDTO typeArtistCrudDTO);
        Task UpdateLyrics(LyricsCrudDTO lyricsCrudDTO);
        #endregion

        #region DELETE
        Task DeleteTrack(string id);
        Task DeleteAlbum(string id);
        Task DeleteArtist(string id);
        Task DeleteGenre(int id);
        Task DeleteTypeArtist(int id);
        Task DeleteLyrics(string id);
        #endregion
    }
}
