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

        public async Task<List<GameDTO>> GetAllGames()
        {
            var games = await _repository.GetAllGames();
            if (games == null)
                return new List<GameDTO>();

            return games.Select(g => new GameDTO
            {
                Id_Game = g.Id_Game,
                Name = g.Name,
                Image_Game = g.Image_Game,
                Description = g.Description
            }).ToList();
        }

        public async Task<GameDTO?> GetGameById(int id)
        {
            var game = await _repository.GetGameById(id);
            if (game == null)
                return null;

            return new GameDTO
            {
                Id_Game = game.Id_Game,
                Name = game.Name,
                Image_Game = game.Image_Game,
                Description = game.Description
            };
        }

        public async Task<TrackVerificationDTO> VerifyTrack(Guid trackId, TrackDTO submittedTrack)
        {
            var correctTrack = await GetTrackById(trackId);
            if (correctTrack == null)
                throw new InvalidOperationException($"Track with id {trackId} not found");

            return new TrackVerificationDTO
            {
                Name = VerifyItem(correctTrack.Name, submittedTrack.Name),
                Artists = VerifyItem(correctTrack.Artist?.Name, submittedTrack.Artist?.Name),
                Nationality = VerifyItem(correctTrack.Artist?.Nationality, submittedTrack.Artist?.Nationality),
                Genres = VerifyItem(correctTrack.Genre?.Libelle, submittedTrack.Genre?.Libelle),
                Album = VerifyItem(correctTrack.Album?.Name, submittedTrack.Album?.Name),
                Followers = VerifyNumeric(correctTrack.Artist?.Nb_Followers ?? 0, submittedTrack.Artist?.Nb_Followers ?? 0),
                Popularity = VerifyNumeric(correctTrack.Popularity, submittedTrack.Popularity),
                Release_Date = VerifyNumeric(correctTrack.Release_Year, submittedTrack.Release_Year)
            };
        }

        public async Task<ArtistVerificationDTO> VerifyArtist(Guid artistId, ArtistDTO submittedArtist)
        {
            var correctArtist = await GetArtistById(artistId);
            if (correctArtist == null)
                throw new InvalidOperationException($"Artist with id {artistId} not found");

            return new ArtistVerificationDTO
            {
                Name = VerifyItem(correctArtist.Name, submittedArtist.Name),
                Nationality = VerifyItem(correctArtist.Nationality, submittedArtist.Nationality),
                Followers = VerifyNumeric(correctArtist.Nb_Followers, submittedArtist.Nb_Followers),
                Start_Date = VerifyItem(correctArtist.Start_Date.ToString("yyyy-MM-dd"), submittedArtist.Start_Date.ToString("yyyy-MM-dd")),
                Last_Release = VerifyItem(correctArtist.Last_Release.ToString("yyyy-MM-dd"), submittedArtist.Last_Release.ToString("yyyy-MM-dd"))
            };
        }

        public async Task<AlbumVerificationDTO> VerifyAlbum(Guid albumId, AlbumDTO submittedAlbum)
        {
            var correctAlbum = await GetAlbumById(albumId);
            if (correctAlbum == null)
                throw new InvalidOperationException($"Album with id {albumId} not found");

            return new AlbumVerificationDTO
            {
                Name = VerifyItem(correctAlbum.Name, submittedAlbum.Name),
                Artist = VerifyItem(correctAlbum.Artist?.Name, submittedAlbum.Artist?.Name),
                Release_Year = VerifyNumeric(correctAlbum.Release_Year, submittedAlbum.Release_Year),
                Nb_Stream = VerifyNumeric(correctAlbum.Nb_Stream, submittedAlbum.Nb_Stream)
            };
        }

        public async Task<LyricsVerificationDTO> VerifyLyrics(Guid lyricsId, LyricsDTO submittedLyrics)
        {
            var correctLyrics = await _repository.GetLyricsById(lyricsId);
            if (correctLyrics == null)
                throw new InvalidOperationException($"Lyrics with id {lyricsId} not found");

            var correctLyricsDTO = new LyricsDTO
            {
                Id_Lyrics = correctLyrics.Id_Lyrics,
                Lyric = correctLyrics.Lyric,
                Id_Tracks = correctLyrics.Id_Tracks
            };

            return new LyricsVerificationDTO
            {
                Lyric = VerifyItem(correctLyricsDTO.Lyric, submittedLyrics.Lyric),
                Track = VerifyItem(correctLyricsDTO.Id_Tracks.ToString(), submittedLyrics.Id_Tracks.ToString())
            };
        }

        public async Task<bool> IncrementGameDayFoundAsync(int gameDayId)
        {
            return await _repository.UpdateGameDayFoundAsync(gameDayId, 1);
        }

        public async Task<TrackResponseDTO?> GetTrackResponseById(Guid id)
        {
            var track = await _repository.GetTrackById(id);
            if (track == null)
                return null;
            return MapTrackResponse(track);
        }

        public async Task<ArtistResponseDTO?> GetArtistResponseById(Guid id)
        {
            var artist = await _repository.GetArtistById(id);
            if (artist == null)
                return null;
            return MapArtistResponse(artist);
        }

        public async Task<AlbumResponseDTO?> GetAlbumResponseById(Guid id)
        {
            var album = await _repository.GetAlbumById(id);
            if (album == null)
                return null;
            return MapAlbumResponse(album);
        }

        public async Task<GameResponseDTO?> GetGameResponseById(int id)
        {
            var game = await _repository.GetGameById(id);
            if (game == null)
                return null;

            return new GameResponseDTO
            {
                Name = game.Name,
                Image_Game = game.Image_Game,
                Description = game.Description
            };
        }

        public async Task<GameDayResponseDTO?> GetGameDayResponseById(int gameDayId)
        {
            var gameDay = await _repository.GetGameDayById(gameDayId);
            if (gameDay == null)
                return null;

            return new GameDayResponseDTO
            {
                Id_Games_Day = gameDay.Id_Games_Day,
                Game = gameDay.Game != null ? new GameResponseDTO
                {
                    Name = gameDay.Game.Name,
                    Image_Game = gameDay.Game.Image_Game,
                    Description = gameDay.Game.Description
                } : null,
                Track = gameDay.Tracks != null ? MapTrackResponse(gameDay.Tracks) : null,
                Artist = gameDay.Artist != null ? MapArtistResponse(gameDay.Artist) : null,
                Album = gameDay.Album != null ? MapAlbumResponse(gameDay.Album) : null,
                Lyrics = gameDay.Lyrics != null ? new LyricsResponseDTO
                {
                    Lyric = gameDay.Lyrics.Lyric,
                    Id_Tracks = gameDay.Lyrics.Id_Tracks
                } : null,
                Found = gameDay.Found
            };
        }

        public async Task<GameDayResponseDTO?> GetGameDayResponseByGameId(int gameId)
        {
            var gameDay = await _repository.GetLatestGameDayByGameId(gameId);
            if (gameDay == null)
                return null;

            return new GameDayResponseDTO
            {
                Id_Games_Day = gameDay.Id_Games_Day,
                Game = gameDay.Game != null ? new GameResponseDTO
                {
                    Name = gameDay.Game.Name,
                    Image_Game = gameDay.Game.Image_Game,
                    Description = gameDay.Game.Description
                } : null,
                Track = gameDay.Tracks != null ? MapTrackResponse(gameDay.Tracks) : null,
                Artist = gameDay.Artist != null ? MapArtistResponse(gameDay.Artist) : null,
                Album = gameDay.Album != null ? MapAlbumResponse(gameDay.Album) : null,
                Lyrics = gameDay.Lyrics != null ? new LyricsResponseDTO
                {
                    Lyric = gameDay.Lyrics.Lyric,
                    Id_Tracks = gameDay.Lyrics.Id_Tracks
                } : null,
                Found = gameDay.Found
            };
        }

        private VerificationResultDTO VerifyItem(string? correctValue, string? submittedValue)
        {
            if (string.IsNullOrEmpty(correctValue) && string.IsNullOrEmpty(submittedValue))
                return new VerificationResultDTO { IsCorrect = true, Status = "correct" };

            if (string.IsNullOrEmpty(correctValue) || string.IsNullOrEmpty(submittedValue))
                return new VerificationResultDTO { IsCorrect = false, Status = "incorrect" };

            bool isExact = correctValue.Equals(submittedValue, StringComparison.OrdinalIgnoreCase);
            return new VerificationResultDTO
            {
                IsCorrect = isExact,
                Status = isExact ? "correct" : "incorrect"
            };
        }

        private VerificationResultDTO VerifyNumeric(int correctValue, int submittedValue)
        {
            bool isCorrect = correctValue == submittedValue;
            return new VerificationResultDTO
            {
                IsCorrect = isCorrect,
                Status = isCorrect ? "correct" : "incorrect"
            };
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

        private ArtistResponseDTO? MapArtistResponse(Artists? entity)
        {
            if (entity == null)
                return null;

            return new ArtistResponseDTO
            {
                Name = entity.Name,
                Start_Date = entity.Start_Date,
                Last_Release = entity.Last_Release,
                Nationality = entity.Nationality,
                Nb_Followers = entity.Nb_Followers,
                Image_Artists = entity.Image_Artists != null ? Convert.ToBase64String(entity.Image_Artists) : null,
                Type_Artists = MapTypeArtist(entity.Type_Artists)
            };
        }

        private AlbumResponseDTO? MapAlbumResponse(Entities.DataGames.Album? entity)
        {
            if (entity == null)
                return null;

            return new AlbumResponseDTO
            {
                Name = entity.Name,
                Release_Year = entity.Release_Year,
                Nb_Stream = entity.Nb_Stream,
                Image_Album = entity.Image_Album != null ? Convert.ToBase64String(entity.Image_Album) : null,
                Is_Single = entity.Is_Single,
                Artist = MapArtistResponse(entity.Artists)
            };
        }

        private TrackResponseDTO? MapTrackResponse(Entities.DataGames.Tracks? entity)
        {
            if (entity == null)
                return null;

            var track = new TrackResponseDTO
            {
                Name = entity.Name,
                Release_Year = entity.Release_Year,
                Popularity = entity.Popularity,
                Feat = entity.Feat,
                Time = entity.Time.ToString(@"hh\:mm\:ss"),
                Url_Source = entity.Url_Source,
                Genre = MapGenre(entity.Genre),
                Album = MapAlbumResponse(entity.Album)
            };

            track.Artist = track.Album?.Artist;
            return track;
        }
        #endregion
    }
}

