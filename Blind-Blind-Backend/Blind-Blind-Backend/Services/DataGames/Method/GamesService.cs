using Blind_Blind_Backend.DTOs.DataGames;
using Blind_Blind_Backend.Entities.DataGames;
using Blind_Blind_Backend.Repositories.DataGames;

namespace Blind_Blind_Backend.Services.DataGames.Method
{
    public class GamesService : IGamesService
    {
        private readonly IGamesRepository _repository;
        public GamesService(IGamesRepository repository)
        {
            _repository = repository;
        }

        public async Task<AlbumDTO?> GetAlbumById(string id)
        {
            var album = await _repository.GetAlbumById(id);

            if (album == null)
                return null;

            return MapAlbum(album);
        }

        public async Task<List<AlbumDTO>> GetAllAlbums()
        {
            var albums = await _repository.GetAllAlbum();
            
            if (albums == null)
                return new List<AlbumDTO>();

            List<AlbumDTO> albumDTOs = new List<AlbumDTO>();
            foreach (var album in albums)
            {
                var albumDTO = MapAlbum(album);
                if (albumDTO != null)
                    albumDTOs.Add(albumDTO);
            }
            return albumDTOs;
        }

        public async Task<List<ArtistDTO>> GetAllArtists()
        {
            var artists = await _repository.GetAllArtists();
            if (artists == null)
                return new List<ArtistDTO>();
            List<ArtistDTO> artistDTOs = new List<ArtistDTO>();
            foreach (var artist in artists)
            {
                var artistDTO = MapArtist(artist);
                if (artistDTO != null)
                    artistDTOs.Add(artistDTO);
            }
            return artistDTOs;
        }

        public async Task<List<TrackDTO>> GetAllTracks()
        {
            var tracks = await _repository.GetAllTracks();
            if (tracks == null)
                return new List<TrackDTO>();
            List<TrackDTO> trackDTOs = new List<TrackDTO>();
            foreach (var track in tracks)
            {
                var trackDTO = MapTrack(track);
                if (trackDTO != null)
                    trackDTOs.Add(trackDTO);
            }
            return trackDTOs;
        }

        public async Task<ArtistDTO?> GetArtistById(string id)
        {
            var artist = await _repository.GetArtistById(id);
            if (artist == null)
                return null;
            return MapArtist(artist);
        }

        public async Task<TrackDTO?> GetTrackById(string id)
        {
            var track = await _repository.GetTrackById(id);
            if (track == null)
                return null;
            return MapTrack(track);
        }

        #region Mapping Methods
        private Type_ArtistsDTO? MapTypeArtist(Type_Artists? entity)
        {
            if (entity == null)
                return null;

            return new Type_ArtistsDTO
            {
                Id_Type_Artists = entity.Id_Type_Artists,
                Type = entity.Type
            };
        }

        private ArtistDTO? MapArtist(Artists? entity)
        {
            if (entity == null)
                return null;

            return new ArtistDTO
            {
                Id_Artist = entity.Id_Artist,
                Name = entity.Name,
                Start_Date = entity.Start_Date,
                Last_Release = entity.Last_Release,
                Nationality = entity.Nationality,
                Nb_Followers = entity.Nb_Followers,
                Image_Artists = entity.Image_Artists,
                Type_Artists = MapTypeArtist(entity.Type_Artists)
            };
        }

        private GenreDTO? MapGenre(Genre? entity)
        {
            if (entity == null)
                return null;

            return new GenreDTO
            {
                Id_Genre = entity.Id_Genre,
                Libelle = entity.Libelle
            };
        }

        private AlbumDTO? MapAlbum(Entities.DataGames.Album? entity)
        {
            if (entity == null)
                return null;

            return new AlbumDTO
            {
                Id_Album = entity.Id_Album,
                Name = entity.Name,
                Release_Year = entity.Release_Year,
                Nb_Stream = entity.Nb_Stream,
                Image_Album = entity.Image_Album,
                Is_Single = entity.Is_Single,
                Artist = MapArtist(entity.Artists)
            };
        }

        private TrackDTO? MapTrack(Entities.DataGames.Tracks? entity)
        {
            if (entity == null)
                return null;

            var track = new TrackDTO
            {
                Id_Track = entity.Id_Tracks,
                Name = entity.Name,
                Release_Year = entity.Release_Year,
                Nb_Stream = entity.Nb_Stream,
                Feat = entity.Feat,
                Time = entity.Time,
                Url_Source = entity.Url_Source,
                Genre = MapGenre(entity.Genre),
                Album = MapAlbum(entity.Album)
            };

            track.Artist = track.Album?.Artist;
            return track;
        }
        #endregion
    }
}
