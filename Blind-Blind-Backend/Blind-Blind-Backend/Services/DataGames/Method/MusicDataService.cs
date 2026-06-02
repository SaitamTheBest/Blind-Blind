using Blind_Blind_Backend.DTOs.DataGames;
using Blind_Blind_Backend.Entities.DataGames;
using Blind_Blind_Backend.Repositories.DataGames;
using Microsoft.AspNetCore.Http;

namespace Blind_Blind_Backend.Services.DataGames.Method
{
    public class MusicDataService : IMusicDataService
    {
        private readonly IMusicDataRepository _repository;
        public MusicDataService(IMusicDataRepository repository)
        {
            _repository = repository;
        }

        private async Task<byte[]?> ConvertFormFileToBytes(IFormFile? file)
        {
            if (file == null || file.Length == 0)
                return null;

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }

        #region GET
        public async Task<AlbumDTO?> GetAlbumById(Guid id)
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

        public async Task<ArtistDTO?> GetArtistById(Guid id)
        {
            var artist = await _repository.GetArtistById(id);
            if (artist == null)
                return null;
            return MapArtist(artist);
        }

        public async Task<TrackDTO?> GetTrackById(Guid id)
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

        public async Task<LyricsDTO?> GetLyricsById(Guid id)
        {
            var lyrics = await _repository.GetLyricsById(id);
            if (lyrics == null)
                return null;
            return MapLyrics(lyrics);
        }
        #endregion

        #region CREATE
        public async Task<Guid> CreateAlbum(AlbumCreateDTO albumCreateDTO)
        {
            var albumId = Guid.NewGuid();
            byte[]? imageBytes = await ConvertFormFileToBytes(albumCreateDTO.Image_Album);

            var album = new Album
            {
                Id_Album = albumId,
                Id_Artists = albumCreateDTO.Id_Artist,
                Name = albumCreateDTO.Name,
                Release_Year = albumCreateDTO.Release_Year,
                Nb_Stream = albumCreateDTO.Nb_Stream,
                Image_Album = imageBytes,
                Is_Single = albumCreateDTO.Is_Single
            };

            await _repository.CreateAlbum(album);

            return album.Id_Album;
        }

        public async Task<Guid> CreateArtist(ArtistCreateDTO artistCreateDTO)
        {
            var artistId = Guid.NewGuid();
            byte[]? imageBytes = await ConvertFormFileToBytes(artistCreateDTO.Image_Artists);

            var artist = new Artists
            {
                Id_Artists = artistId,
                Name = artistCreateDTO.Name,
                Start_Date = artistCreateDTO.Start_Date,
                Last_Release = artistCreateDTO.Last_Release,
                Id_Type_Artists = artistCreateDTO.Id_Type_Artists,
                Nationality = artistCreateDTO.Nationality,
                Nb_Followers = artistCreateDTO.Nb_Followers,
                Image_Artists = imageBytes
            };

            await _repository.CreateArtist(artist);

            return artist.Id_Artists;
        }

        public async Task<Guid> CreateTrack(TrackCreateDTO trackCreateDTO)
        {
            var trackId = Guid.NewGuid();
            var featuringsExist = trackCreateDTO.List_Id_Featurings != null && trackCreateDTO.List_Id_Featurings.Any();

            var track = new Tracks
            {
                Id_Tracks = trackId,
                Name = trackCreateDTO.Name,
                Release_Year = trackCreateDTO.Release_Year,
                Popularity = trackCreateDTO.Popularity,
                Feat = featuringsExist,
                Time = ParseTrackDuration(trackCreateDTO.Time),
                Url_Source = trackCreateDTO.Url_Source,
                Id_Genre = trackCreateDTO.Id_Genre,
                Id_Album = trackCreateDTO.Id_Album,
            };

            await _repository.CreateTrack(track);

            if (featuringsExist)
            {
                await AddFeaturingsToTrack(trackId, trackCreateDTO.List_Id_Featurings!);
            }

            return track.Id_Tracks;
        }

        public Task AddFeaturingsToTrack(Guid trackId, List<Guid> artistIds)
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

        public Task CreateLyrics(LyricsCreateDTO lyricsCreateDTO)
        {
            var lyrics = new Lyrics
            {
                Id_Lyrics = Guid.NewGuid(),
                Lyric = lyricsCreateDTO.Lyric,
                Id_Tracks = lyricsCreateDTO.Id_Tracks
            };

            return _repository.CreateLyrics(lyrics);
        }
        #endregion


        #region UPDATE
        public async Task UpdateAlbum(AlbumUpdateDTO albumUpdateDTO)
        {
            if (albumUpdateDTO.Id_Album == Guid.Empty)
                throw new ArgumentException("L'ID de l'album est requis pour la mise à jour.");

            byte[]? imageBytes = await ConvertFormFileToBytes(albumUpdateDTO.Image_Album);

            var album = new Album
            {
                Id_Album = albumUpdateDTO.Id_Album,
                Id_Artists = albumUpdateDTO.Id_Artist,
                Name = albumUpdateDTO.Name,
                Release_Year = albumUpdateDTO.Release_Year,
                Nb_Stream = albumUpdateDTO.Nb_Stream,
                Image_Album = imageBytes,
                Is_Single = albumUpdateDTO.Is_Single
            };

            await _repository.UpdateAlbum(album);
        }

        public async Task UpdateArtist(ArtistUpdateDTO artistUpdateDTO)
        {
            if (artistUpdateDTO.Id_Artists == Guid.Empty)
                throw new ArgumentException("L'ID de l'artiste est requis pour la mise à jour.");

            byte[]? imageBytes = await ConvertFormFileToBytes(artistUpdateDTO.Image_Artists);

            var artist = new Artists
            {
                Id_Artists = artistUpdateDTO.Id_Artists,
                Name = artistUpdateDTO.Name,
                Start_Date = artistUpdateDTO.Start_Date,
                Last_Release = artistUpdateDTO.Last_Release,
                Id_Type_Artists = artistUpdateDTO.Id_Type_Artists,
                Nationality = artistUpdateDTO.Nationality,
                Nb_Followers = artistUpdateDTO.Nb_Followers,
                Image_Artists = imageBytes
            };

            await _repository.UpdateArtist(artist);
        }

        public async Task UpdateTrack(TrackUpdateDTO trackUpdateDTO)
        {
            if (trackUpdateDTO.Id_Tracks == Guid.Empty)
                throw new ArgumentException("L'ID de la track est requis pour la mise à jour.");

            var featuringsExist = trackUpdateDTO.List_Id_Featurings != null && trackUpdateDTO.List_Id_Featurings.Any();

            var track = new Tracks
            {
                Id_Tracks = trackUpdateDTO.Id_Tracks,
                Name = trackUpdateDTO.Name,
                Release_Year = trackUpdateDTO.Release_Year,
                Popularity = trackUpdateDTO.Popularity,
                Feat = featuringsExist,
                Time = ParseTrackDuration(trackUpdateDTO.Time),
                Url_Source = trackUpdateDTO.Url_Source,
                Id_Genre = trackUpdateDTO.Id_Genre,
                Id_Album = trackUpdateDTO.Id_Album,
            };

            await _repository.UpdateTrack(track);

            await UpdateFeaturingsForTrack(trackUpdateDTO.Id_Tracks, trackUpdateDTO.List_Id_Featurings ?? new List<Guid>());
        }

        public async Task UpdateFeaturingsForTrack(Guid trackId, List<Guid> artistIds)
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

        public Task UpdateLyrics(LyricsUpdateDTO lyricsUpdateDTO)
        {
            if (lyricsUpdateDTO.Id_Lyrics == Guid.Empty)
                throw new ArgumentException("L'ID des paroles est requis pour la mise à jour.");

            var lyrics = new Lyrics
            {
                Id_Lyrics = lyricsUpdateDTO.Id_Lyrics,
                Lyric = lyricsUpdateDTO.Lyric,
                Id_Tracks = lyricsUpdateDTO.Id_Tracks
            };

            return _repository.UpdateLyrics(lyrics);
        }
        #endregion

        #region DELETE
        public Task DeleteAlbum(Guid id)
        {
            if (id == Guid.Empty)
                throw new ArgumentException("L'ID est requis pour la suppression.");
            return _repository.DeleteAlbum(id);
        }

        public Task DeleteArtist(Guid id)
        {
            if (id == Guid.Empty)
                throw new ArgumentException("L'ID est requis pour la suppression.");
            return _repository.DeleteArtist(id);
        }

        public async Task DeleteTrack(Guid id)
        {
            if (id == Guid.Empty)
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

        public Task DeleteLyrics(Guid id)
        {
            if (id == Guid.Empty)
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
                Image_Artists = entity.Image_Artists != null ? Convert.ToBase64String(entity.Image_Artists) : null,
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
                Image_Album = entity.Image_Album != null ? Convert.ToBase64String(entity.Image_Album) : null,
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
                Time = entity.Time.ToString(@"hh\:mm\:ss"),
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

        private static TimeSpan ParseTrackDuration(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return TimeSpan.Zero;
            }

            var trimmed = value.Trim();

            // Format mm:ss, exemple : 03:45
            if (System.Text.RegularExpressions.Regex.IsMatch(trimmed, @"^\d{1,2}:\d{2}$"))
            {
                var parts = trimmed.Split(':');
                var minutes = int.Parse(parts[0]);
                var seconds = int.Parse(parts[1]);

                return new TimeSpan(0, minutes, seconds);
            }

            // Format hh:mm:ss, exemple : 00:03:45
            if (System.Text.RegularExpressions.Regex.IsMatch(trimmed, @"^\d{1,2}:\d{2}:\d{2}$"))
            {
                var parts = trimmed.Split(':');
                var hours = int.Parse(parts[0]);
                var minutes = int.Parse(parts[1]);
                var seconds = int.Parse(parts[2]);

                return new TimeSpan(hours, minutes, seconds);
            }

            throw new ArgumentException("La durée doit être au format mm:ss ou hh:mm:ss.");
        }
        #endregion
    }
}
