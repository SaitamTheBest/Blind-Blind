using Blind_Blind_Backend.DTOs.DataGames;

namespace Blind_Blind_Backend.Services.DataGames
{
    public interface IMusicDataService
    {
        #region GET
        Task<AlbumDTO?> GetAlbumById(Guid id);
        Task<List<AlbumDTO>> GetAllAlbums();
        Task<List<ArtistDTO>> GetAllArtists();
        Task<List<TrackDTO>> GetAllTracks();
        Task<ArtistDTO?> GetArtistById(Guid id);
        Task<TrackDTO?> GetTrackById(Guid id);
        Task<List<GenreDTO>> GetAllGenres();
        Task<GenreDTO?> GetGenreById(int id);
        Task<List<Type_ArtistsDTO>> GetAllTypeArtists();
        Task<Type_ArtistsDTO?> GetTypeArtistById(int id);
        Task<List<LyricsDTO>> GetAllLyrics();
        Task<LyricsDTO?> GetLyricsById(Guid id);
        #endregion

        #region CREATE
        Task<Guid> CreateTrack(TrackCreateDTO trackCreateDTO);
        Task<Guid> CreateAlbum(AlbumCreateDTO albumCreateDTO);
        Task<Guid> CreateArtist(ArtistCreateDTO artistCreateDTO);
        Task AddFeaturingsToTrack(Guid trackId, List<Guid> artistIds);
        Task CreateGenre(GenreCrudDTO genreCrudDTO);
        Task CreateTypeArtist(Type_ArtistsCrudDTO typeArtistCrudDTO);
        Task CreateLyrics(LyricsCreateDTO lyricsCreateDTO);
        #endregion

        #region UPDATE
        Task UpdateTrack(TrackUpdateDTO trackUpdateDTO);
        Task UpdateAlbum(AlbumUpdateDTO albumUpdateDTO);
        Task UpdateArtist(ArtistUpdateDTO artistUpdateDTO);
        Task UpdateFeaturingsForTrack(Guid trackId, List<Guid> artistIds);
        Task UpdateGenre(GenreCrudDTO genreCrudDTO);
        Task UpdateTypeArtist(Type_ArtistsCrudDTO typeArtistCrudDTO);
        Task UpdateLyrics(LyricsUpdateDTO lyricsUpdateDTO);
        #endregion

        #region DELETE
        Task DeleteTrack(Guid id);
        Task DeleteAlbum(Guid id);
        Task DeleteArtist(Guid id);
        Task DeleteGenre(int id);
        Task DeleteTypeArtist(int id);
        Task DeleteLyrics(Guid id);
        #endregion
    }
}
