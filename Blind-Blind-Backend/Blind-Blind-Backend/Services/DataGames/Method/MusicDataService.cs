using Blind_Blind_Backend.DTOs.DataGames;
using Blind_Blind_Backend.Entities.DataGames;
using Blind_Blind_Backend.Repositories.DataGames;

namespace Blind_Blind_Backend.Services.DataGames.Method
{
    public class MusicDataService : IMusicDataService
    {
        private readonly IMusicDataRepository _repository;
        public MusicDataService(IMusicDataRepository repository)
        {
            _repository = repository;
        }

        #region GET
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

        public async Task<List<GenreDTO>> GetAllGenres()
        {
            var genres = await _repository.GetAllGenres();
            if (genres == null)
                return new List<GenreDTO>();
            List<GenreDTO> genreDTOs = new List<GenreDTO>();
            foreach (var genre in genres)
            {
                var genreDTO = MapGenre(genre);
                if (genreDTO != null)
                    genreDTOs.Add(genreDTO);
            }
            return genreDTOs;
        }

        public async Task<GenreDTO?> GetGenreById(int id)
        {
            var genre = await _repository.GetGenreById(id);
            if (genre == null)
                return null;
            return MapGenre(genre);
        }

        public async Task<List<Type_ArtistsDTO>> GetAllTypeArtists()
        {
            var typeArtists = await _repository.GetAllTypeArtists();
            if (typeArtists == null)
                return new List<Type_ArtistsDTO>();
            List<Type_ArtistsDTO> typeArtistDTOs = new List<Type_ArtistsDTO>();
            foreach (var typeArtist in typeArtists)
            {
                var typeArtistDTO = MapTypeArtist(typeArtist);
                if (typeArtistDTO != null)
                    typeArtistDTOs.Add(typeArtistDTO);
            }
            return typeArtistDTOs;
        }

        public async Task<Type_ArtistsDTO?> GetTypeArtistById(int id)
        {
            var typeArtist = await _repository.GetTypeArtistById(id);
            if (typeArtist == null)
                return null;
            return MapTypeArtist(typeArtist);
        }

        public async Task<List<LyricsDTO>> GetAllLyrics()
        {
            var lyrics = await _repository.GetAllLyrics();
            if (lyrics == null)
                return new List<LyricsDTO>();
            List<LyricsDTO> lyricsDTOs = new List<LyricsDTO>();
            foreach (var lyric in lyrics)
            {
                var lyricDTO = MapLyrics(lyric);
                if (lyricDTO != null)
                    lyricsDTOs.Add(lyricDTO);
            }
            return lyricsDTOs;
        }

        public async Task<LyricsDTO?> GetLyricsById(string id)
        {
            var lyrics = await _repository.GetLyricsById(id);
            if (lyrics == null)
                return null;
            return MapLyrics(lyrics);
        }
        #endregion

        #region CREATE
        public Task CreateAlbum(AlbumCrudDTO albumCrudDTO)
        {
            var album = new Album
            {
                Id_Album = Guid.NewGuid().ToString(),
                Id_Artists = albumCrudDTO.Artist,
                Name = albumCrudDTO.Name,
                Release_Year = albumCrudDTO.Release_Year,
                Nb_Stream = albumCrudDTO.Nb_Stream,
                Image_Album = albumCrudDTO.Image_Album,
                Is_Single = albumCrudDTO.Is_Single
            };

            return _repository.CreateAlbum(album);
        }

        public Task CreateArtist(ArtistCrudDTO artistCrudDTO)
        {
            var artist = new Artists
            {
                Id_Artists = Guid.NewGuid().ToString(),
                Name = artistCrudDTO.Name,
                Start_Date = artistCrudDTO.Start_Date,
                Last_Release = artistCrudDTO.Last_Release,
                Id_Type_Artists = artistCrudDTO.Id_Type_Artists,
                Nationality = artistCrudDTO.Nationality,
                Nb_Followers = artistCrudDTO.Nb_Followers,
                Image_Artists = artistCrudDTO.Image_Artists
            };

            return _repository.CreateArtist(artist);
        }

        public async Task CreateTrack(TrackCrudDTO trackCrudDTO)
        {
            var trackId = Guid.NewGuid().ToString();
            var featuringsExist = trackCrudDTO.List_Id_Featurings != null && trackCrudDTO.List_Id_Featurings.Any();

            var track = new Tracks
            {
                Id_Tracks = trackId,
                Name = trackCrudDTO.Name,
                Release_Year = trackCrudDTO.Release_Year,
                Popularity = trackCrudDTO.Popularity,
                Feat = featuringsExist,
                Time = trackCrudDTO.Time,
                Url_Source = trackCrudDTO.Url_Source,
                Id_Genre = trackCrudDTO.Id_Genre,
                Id_Album = trackCrudDTO.Id_Album,
            };

            await _repository.CreateTrack(track);

            if (featuringsExist)
            {
                await AddFeaturingsToTrack(trackId, trackCrudDTO.List_Id_Featurings!);
            }
        }

        public Task AddFeaturingsToTrack(string trackId, List<string> artistIds)
        {
            var featurings = artistIds.Select(artistId => new Featurings
            {
                Id_Tracks = trackId,
                Id_Artists = artistId
            }).ToList();

            return _repository.AddFeaturings(featurings);
        }

        public Task CreateGenre(GenreCrudDTO genreCrudDTO)
        {
            var genre = new Genre_Tracks
            {
                Libelle = genreCrudDTO.Libelle
            };

            return _repository.CreateGenre(genre);
        }

        public Task CreateTypeArtist(Type_ArtistsCrudDTO typeArtistCrudDTO)
        {
            var typeArtist = new Type_Artists
            {
                Type = typeArtistCrudDTO.Type
            };

            return _repository.CreateTypeArtist(typeArtist);
        }

        public Task CreateLyrics(LyricsCrudDTO lyricsCrudDTO)
        {
            var lyrics = new Lyrics
            {
                Id_Lyrics = lyricsCrudDTO.Id_Lyrics,
                Lyric = lyricsCrudDTO.Lyric,
                Id_Tracks = lyricsCrudDTO.Id_Tracks
            };

            return _repository.CreateLyrics(lyrics);
        }
        #endregion


        #region UPDATE
        public Task UpdateAlbum(AlbumCrudDTO albumCrudDTO)
        {
            if (string.IsNullOrEmpty(albumCrudDTO.Id_Album))
                throw new ArgumentException("L'ID de l'album est requis pour la mise à jour.");

            var album = new Album
            {
                Id_Album = albumCrudDTO.Id_Album,
                Id_Artists = albumCrudDTO.Artist,
                Name = albumCrudDTO.Name,
                Release_Year = albumCrudDTO.Release_Year,
                Nb_Stream = albumCrudDTO.Nb_Stream,
                Image_Album = albumCrudDTO.Image_Album,
                Is_Single = albumCrudDTO.Is_Single
            };

            return _repository.UpdateAlbum(album);
        }

        public Task UpdateArtist(ArtistCrudDTO artistCrudDTO)
        {
            if (string.IsNullOrEmpty(artistCrudDTO.Id_Artists))
                throw new ArgumentException("L'ID de l'artiste est requis pour la mise à jour.");

            var artist = new Artists
            {
                Id_Artists = artistCrudDTO.Id_Artists,
                Name = artistCrudDTO.Name,
                Start_Date = artistCrudDTO.Start_Date,
                Last_Release = artistCrudDTO.Last_Release,
                Id_Type_Artists = artistCrudDTO.Id_Type_Artists,
                Nationality = artistCrudDTO.Nationality,
                Nb_Followers = artistCrudDTO.Nb_Followers,
                Image_Artists = artistCrudDTO.Image_Artists
            };

            return _repository.UpdateArtist(artist);
        }

        public async Task UpdateTrack(TrackCrudDTO trackCrudDTO)
        {
            if (string.IsNullOrEmpty(trackCrudDTO.Id_Tracks))
                throw new ArgumentException("L'ID de la track est requis pour la mise à jour.");

            var featuringsExist = trackCrudDTO.List_Id_Featurings != null && trackCrudDTO.List_Id_Featurings.Any();

            var track = new Tracks
            {
                Id_Tracks = trackCrudDTO.Id_Tracks,
                Name = trackCrudDTO.Name,
                Release_Year = trackCrudDTO.Release_Year,
                Popularity = trackCrudDTO.Popularity,
                Feat = featuringsExist,
                Time = trackCrudDTO.Time,
                Url_Source = trackCrudDTO.Url_Source,
                Id_Genre = trackCrudDTO.Id_Genre,
                Id_Album = trackCrudDTO.Id_Album,
            };

            await _repository.UpdateTrack(track);

            await UpdateFeaturingsForTrack(trackCrudDTO.Id_Tracks, trackCrudDTO.List_Id_Featurings ?? new List<string>());
        }

        public async Task UpdateFeaturingsForTrack(string trackId, List<string> artistIds)
        {
            await _repository.DeleteFeaturingsByTrackAsync(trackId);

            if (artistIds != null && artistIds.Any())
            {
                await AddFeaturingsToTrack(trackId, artistIds);
            }
        }

        public Task UpdateGenre(GenreCrudDTO genreCrudDTO)
        {
            var genre = new Genre_Tracks
            {
                Libelle = genreCrudDTO.Libelle
            };

            return _repository.UpdateGenre(genre);
        }

        public Task UpdateTypeArtist(Type_ArtistsCrudDTO typeArtistCrudDTO)
        {
            var typeArtist = new Type_Artists
            {
                Type = typeArtistCrudDTO.Type
            };

            return _repository.UpdateTypeArtist(typeArtist);
        }

        public Task UpdateLyrics(LyricsCrudDTO lyricsCrudDTO)
        {
            if (string.IsNullOrEmpty(lyricsCrudDTO.Id_Lyrics))
                throw new ArgumentException("L'ID des paroles est requis pour la mise à jour.");

            var lyrics = new Lyrics
            {
                Id_Lyrics = lyricsCrudDTO.Id_Lyrics,
                Lyric = lyricsCrudDTO.Lyric,
                Id_Tracks = lyricsCrudDTO.Id_Tracks
            };

            return _repository.UpdateLyrics(lyrics);
        }
        #endregion

        #region DELETE
        public Task DeleteAlbum(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentException("L'ID est requis pour la suppression.");
            return _repository.DeleteAlbum(id);
        }

        public Task DeleteArtist(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentException("L'ID est requis pour la suppression.");
            return _repository.DeleteArtist(id);
        }

        public async Task DeleteTrack(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentException("L'ID est requis pour la suppression.");

            await _repository.DeleteFeaturingsByTrackAsync(id);
            await _repository.DeleteTrack(id);
        }

        public Task DeleteGenre(int id)
        {
            return _repository.DeleteGenre(id);
        }

        public Task DeleteTypeArtist(int id)
        {
            return _repository.DeleteTypeArtist(id);
        }

        public Task DeleteLyrics(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentException("L'ID est requis pour la suppression.");
            return _repository.DeleteLyrics(id);
        }
        #endregion

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
                Id_Artists = entity.Id_Artists,
                Name = entity.Name,
                Start_Date = entity.Start_Date,
                Last_Release = entity.Last_Release,
                Nationality = entity.Nationality,
                Nb_Followers = entity.Nb_Followers,
                Image_Artists = entity.Image_Artists,
                Type_Artists = MapTypeArtist(entity.Type_Artists)
            };
        }

        private GenreDTO? MapGenre(Genre_Tracks? entity)
        {
            if (entity == null)
                return null;

            return new GenreDTO
            {
                Id_Genre = entity.Id_Genre_Tracks,
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
                Popularity = entity.Popularity,
                Feat = entity.Feat,
                Time = entity.Time,
                Url_Source = entity.Url_Source,
                Genre = MapGenre(entity.Genre),
                Album = MapAlbum(entity.Album)
            };

            track.Artist = track.Album?.Artist;
            return track;
        }

        private LyricsDTO? MapLyrics(Lyrics? entity)
        {
            if (entity == null)
                return null;

            return new LyricsDTO
            {
                Id_Lyrics = entity.Id_Lyrics,
                Lyric = entity.Lyric,
                Id_Tracks = entity.Id_Tracks
            };
        }
        #endregion
    }
}
