using Blind_Blind_Backend.Domain;
using Blind_Blind_Backend.Entities.DataGames;
using Microsoft.EntityFrameworkCore;

namespace Blind_Blind_Backend.Repositories.DataGames.Methods
{
    public class MusicDataRepository : IMusicDataRepository
    {
        private readonly BlindBlindContext context;

        public MusicDataRepository(BlindBlindContext context)
        {
            this.context = context;
        }

        #region CREATE
        public async Task CreateAlbum(Album album)
        {
            context.Album.Add(album);
            await context.SaveChangesAsync();
        }

        public async Task CreateArtist(Artists artist)
        {
            context.Artists.Add(artist);
            await context.SaveChangesAsync();
        }

        public async Task CreateTrack(Tracks track)
        {
            context.Tracks.Add(track);
            await context.SaveChangesAsync();
        }

        public async Task AddFeaturings(IEnumerable<Featurings> featurings)
        {
            context.Featurings.AddRange(featurings);
            await context.SaveChangesAsync();
        }
        #endregion

        #region UPDATE
        public async Task UpdateAlbum(Album album)
        {
            context.Album.Update(album);
            await context.SaveChangesAsync();
        }

        public async Task UpdateArtist(Artists artist)
        {
            context.Artists.Update(artist);
            await context.SaveChangesAsync();
        }

        public async Task UpdateTrack(Tracks track)
        {
            context.Tracks.Update(track);
            await context.SaveChangesAsync();
        }
        #endregion

        #region DELETE
        public async Task DeleteAlbum(string id)
        {
            var album = await context.Album.FindAsync(id);
            if (album != null)
            {
                context.Album.Remove(album);
                await context.SaveChangesAsync();
            }
        }

        public async Task DeleteArtist(string id)
        {
            var artist = context.Artists.Find(id);
            if (artist != null)
            {
                context.Artists.Remove(artist);
                await context.SaveChangesAsync();
            }
        }

        public async Task DeleteTrack(string id)
        {
            var track = context.Tracks.Find(id);
            if (track != null)
            {
                context.Tracks.Remove(track);
                await context.SaveChangesAsync();
            }
        }

        public async Task DeleteFeaturingsByTrackAsync(string id_track)
        {
            var featurings = context.Featurings.Where(f => f.Id_Tracks == id_track);
            context.Featurings.RemoveRange(featurings);
            await context.SaveChangesAsync();
        }
        #endregion
    }
}
