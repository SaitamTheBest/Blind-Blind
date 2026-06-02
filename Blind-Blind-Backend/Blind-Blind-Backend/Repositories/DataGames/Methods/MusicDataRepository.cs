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

        #region GET
        public async Task<Album?> GetAlbumById(Guid id)
        {
            return await context.Album
                .Include(a => a.Artists)
                    .ThenInclude(a => a.Type_Artists)
                .FirstOrDefaultAsync(album => album.Id_Album == id);
        }

        public Task<List<Album>> GetAllAlbum()
        {
            return context.Album
                .Include(a => a.Artists)
                    .ThenInclude(a => a.Type_Artists)
                .ToListAsync();
        }

        public Task<List<Artists>> GetAllArtists()
        {
            return context.Artists
                .Include(a => a.Type_Artists)
                .ToListAsync();
        }

        public Task<List<Tracks>> GetAllTracks()
        {
            return context.Tracks
                .Include(t => t.Genre)
                .Include(t => t.Album)
                    .ThenInclude(a => a.Artists)
                        .ThenInclude(a => a.Type_Artists)
                .Include(t => t.Featurings)
                    .ThenInclude(f => f.Artists)
                .ToListAsync();
        }

        public async Task<Artists?> GetArtistById(Guid id)
        {
            return await context.Artists
                .Include(a => a.Type_Artists)
                .FirstOrDefaultAsync(artists => artists.Id_Artists == id);
        }

        public async Task<Tracks?> GetTrackById(Guid id)
        {
            return await context.Tracks
                .Include(t => t.Genre)
                .Include(t => t.Album)
                    .ThenInclude(a => a.Artists)
                        .ThenInclude(a => a.Type_Artists)
                .Include(t => t.Featurings)
                    .ThenInclude(f => f.Artists)
                .FirstOrDefaultAsync(tracks => tracks.Id_Tracks == id);
        }

        public Task<List<Genre_Tracks>> GetAllGenres()
        {
            return context.Genres.ToListAsync();
        }

        public async Task<Genre_Tracks?> GetGenreById(int id)
        {
            return await context.Genres
                .FirstOrDefaultAsync(g => g.Id_Genre_Tracks == id);
        }

        public Task<List<Type_Artists>> GetAllTypeArtists()
        {
            return context.Type_Artists.ToListAsync();
        }

        public async Task<Type_Artists?> GetTypeArtistById(int id)
        {
            return await context.Type_Artists
                .FirstOrDefaultAsync(ta => ta.Id_Type_Artists == id);
        }

        public Task<List<Lyrics>> GetAllLyrics()
        {
            return context.Lyrics
                .Include(l => l.Tracks)
                .ToListAsync();
        }

        public async Task<Lyrics?> GetLyricsById(Guid id)
        {
            return await context.Lyrics
                .Include(l => l.Tracks)
                .FirstOrDefaultAsync(l => l.Id_Lyrics == id);
        }
        #endregion

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

        public async Task CreateGenre(Genre_Tracks genre)
        {
            context.Genres.Add(genre);
            await context.SaveChangesAsync();
        }

        public async Task CreateTypeArtist(Type_Artists typeArtist)
        {
            context.Type_Artists.Add(typeArtist);
            await context.SaveChangesAsync();
        }

        public async Task CreateLyrics(Lyrics lyrics)
        {
            context.Lyrics.Add(lyrics);
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

        public async Task UpdateGenre(Genre_Tracks genre)
        {
            context.Genres.Update(genre);
            await context.SaveChangesAsync();
        }

        public async Task UpdateTypeArtist(Type_Artists typeArtist)
        {
            context.Type_Artists.Update(typeArtist);
            await context.SaveChangesAsync();
        }

        public async Task UpdateLyrics(Lyrics lyrics)
        {
            context.Lyrics.Update(lyrics);
            await context.SaveChangesAsync();
        }
        #endregion

        #region DELETE
        public async Task DeleteAlbum(Guid id)
        {
            var album = await context.Album.FindAsync(id);
            if (album != null)
            {
                context.Album.Remove(album);
                await context.SaveChangesAsync();
            }
        }

        public async Task DeleteArtist(Guid id)
        {
            var artist = context.Artists.Find(id);
            if (artist != null)
            {
                context.Artists.Remove(artist);
                await context.SaveChangesAsync();
            }
        }

        public async Task DeleteTrack(Guid id)
        {
            var track = context.Tracks.Find(id);
            if (track != null)
            {
                context.Tracks.Remove(track);
                await context.SaveChangesAsync();
            }
        }

        public async Task DeleteFeaturingsByTrackAsync(Guid id_track)
        {
            var featurings = context.Featurings.Where(f => f.Id_Tracks == id_track);
            context.Featurings.RemoveRange(featurings);
            await context.SaveChangesAsync();
        }

        public async Task DeleteGenre(int id)
        {
            var genre = await context.Genres.FindAsync(id);
            if (genre != null)
            {
                context.Genres.Remove(genre);
                await context.SaveChangesAsync();
            }
        }

        public async Task DeleteTypeArtist(int id)
        {
            var typeArtist = await context.Type_Artists.FindAsync(id);
            if (typeArtist != null)
            {
                context.Type_Artists.Remove(typeArtist);
                await context.SaveChangesAsync();
            }
        }

        public async Task DeleteLyrics(Guid id)
        {
            var lyrics = await context.Lyrics.FindAsync(id);
            if (lyrics != null)
            {
                context.Lyrics.Remove(lyrics);
                await context.SaveChangesAsync();
            }
        }
        #endregion
    }
}
