using Blind_Blind_Backend.DTOs.DataGames;
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
        public Task CreateAlbum(AlbumDTO albumDTO)
        {
            throw new NotImplementedException();
        }

        public Task CreateArtist(ArtistDTO artistDTO)
        {
            throw new NotImplementedException();
        }

        public Task CreateTrack(TrackDTO trackDTO)
        {
            throw new NotImplementedException();
        }
        #endregion


        #region UPDATE
        public Task UpdateAlbum(AlbumDTO albumDTO)
        {
            throw new NotImplementedException();
        }

        public Task UpdateArtist(ArtistDTO artistDTO)
        {
            throw new NotImplementedException();
        }

        public Task UpdateTrack(TrackDTO trackDTO)
        {
            throw new NotImplementedException();
        }
        #endregion

        #region DELETE
        public Task DeleteAlbum(string id)
        {
            throw new NotImplementedException();
        }

        public Task DeleteArtist(string id)
        {
            throw new NotImplementedException();
        }

        public Task DeleteTrack(string id)
        {
            throw new NotImplementedException();
        }
        #endregion
    }
}
