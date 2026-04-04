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

        #region
        public Task CreateAlbum(AlbumCrudDTO albumCrudDTO)
        {
            var album = new Album
            {
                Id_Album = Guid.NewGuid().ToString(),
                Id_Artist = albumCrudDTO.Artist,
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
                Id_Artist = Guid.NewGuid().ToString(),
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
                Nb_Stream = trackCrudDTO.Nb_Stream,
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
                Id_Artist = artistId
            }).ToList();

            return _repository.AddFeaturings(featurings);
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
                Id_Artist = albumCrudDTO.Artist,
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
            if (string.IsNullOrEmpty(artistCrudDTO.Id_Artist))
                throw new ArgumentException("L'ID de l'artiste est requis pour la mise à jour.");

            var artist = new Artists
            {
                Id_Artist = artistCrudDTO.Id_Artist,
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
                Nb_Stream = trackCrudDTO.Nb_Stream,
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
        #endregion
    }
}
