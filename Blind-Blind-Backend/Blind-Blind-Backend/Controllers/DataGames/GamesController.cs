using Blind_Blind_Backend.DTOs.DataGames;
using Blind_Blind_Backend.Services.DataGames;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Blind_Blind_Backend.Controllers.DataGames
{
    [ApiController]
    [Route("api/games")]
    public class GamesController : ControllerBase
    {
        private readonly IGamesService _service;
        public GamesController(IGamesService service)
        {
            _service = service;
        }

        /// <summary>
        /// Retrieves all tracks
        /// </summary>
        [HttpGet("tracks")]
        public async Task<ActionResult<List<TrackDTO>>> GetAllTracks()
        {
            var tracks = await _service.GetAllTracks();
            return Ok(tracks);
        }

        /// <summary>
        /// Retrieves a specific track by its ID
        /// </summary>
        [HttpGet("tracks/{id}")]
        public async Task<ActionResult<TrackDTO>> GetTrackById(Guid id)
        {
            var track = await _service.GetTrackById(id);
            if (track == null)
                return NotFound($"Track with id {id} not found");
            return Ok(track);
        }

        /// <summary>
        /// Retrieves all artists
        /// </summary>
        [HttpGet("artists")]
        public async Task<ActionResult<List<ArtistDTO>>> GetAllArtists()
        {
            var artists = await _service.GetAllArtists();
            return Ok(artists);
        }

        /// <summary>
        /// Retrieves a specific artist by its ID
        /// </summary>
        [HttpGet("artists/{id}")]
        public async Task<ActionResult<ArtistDTO>> GetArtistById(Guid id)
        {
            var artist = await _service.GetArtistById(id);
            if (artist == null)
                return NotFound($"Artist with id {id} not found");
            return Ok(artist);
        }

        /// <summary>
        /// Retrieves all albums
        /// </summary>
        [HttpGet("albums")]
        public async Task<ActionResult<List<AlbumDTO>>> GetAllAlbums()
        {
            var albums = await _service.GetAllAlbums();
            return Ok(albums);
        }

        /// <summary>
        /// Retrieves a specific album by its ID
        /// </summary>
        [HttpGet("albums/{id}")]
        public async Task<ActionResult<AlbumDTO>> GetAlbumById(Guid id)
        {
            var album = await _service.GetAlbumById(id);
            if (album == null)
                return NotFound($"Album with id {id} not found");
            return Ok(album);
        }

        /// <summary>
        /// Retrieves a specific game by its ID without the ID field (for victory display)
        /// </summary>
        [HttpGet("response/{id}")]
        public async Task<ActionResult<GameResponseDTO>> GetGameResponseById(int id)
        {
            var game = await _service.GetGameResponseById(id);
            if (game == null)
                return NotFound($"Game with id {id} not found");
            return Ok(game);
        }

        /// <summary>
        /// Retrieves a specific track by its ID without the ID field (for victory display)
        /// </summary>
        [HttpGet("tracks/response/{id}")]
        public async Task<ActionResult<TrackResponseDTO>> GetTrackResponseById(Guid id)
        {
            var track = await _service.GetTrackResponseById(id);
            if (track == null)
                return NotFound($"Track with id {id} not found");
            return Ok(track);
        }

        /// <summary>
        /// Retrieves a specific artist by its ID without the ID field (for victory display)
        /// </summary>
        [HttpGet("artists/response/{id}")]
        public async Task<ActionResult<ArtistResponseDTO>> GetArtistResponseById(Guid id)
        {
            var artist = await _service.GetArtistResponseById(id);
            if (artist == null)
                return NotFound($"Artist with id {id} not found");
            return Ok(artist);
        }

        /// <summary>
        /// Retrieves a specific album by its ID without the ID field (for victory display)
        /// </summary>
        [HttpGet("albums/response/{id}")]
        public async Task<ActionResult<AlbumResponseDTO>> GetAlbumResponseById(Guid id)
        {
            var album = await _service.GetAlbumResponseById(id);
            if (album == null)
                return NotFound($"Album with id {id} not found");
            return Ok(album);
        }

        /// <summary>
        /// Retrieves the correct answers for today's game of the day
        /// Returns game, track, artist, album, and lyrics information without IDs
        /// </summary>
        [HttpGet("game-day/{gameId}/response")]
        public async Task<ActionResult<GameDayResponseDTO>> GetGameDayResponse(int gameId)
        {
            var gameDayResponse = await _service.GetGameDayResponseByGameId(gameId);
            if (gameDayResponse == null)
                return NotFound($"No game day found for game with id {gameId}");
            return Ok(gameDayResponse);
        }

        /// <summary>
        /// Verifies a submitted track against the correct track
        /// Returns verification results for each field (name, artists, nationality, genres, album, followers, popularity, release_date)
        /// Each field has a status: "correct", "incorrect", or "partial"
        /// </summary>
        [HttpPost("verify/track/{trackId}")]
        public async Task<ActionResult<TrackVerificationDTO>> VerifyTrack(Guid trackId, [FromBody] TrackDTO submittedTrack)
        {
            if (submittedTrack == null)
                return BadRequest("Submitted track data is required");

            try
            {
                var verification = await _service.VerifyTrack(trackId, submittedTrack);
                return Ok(verification);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Verifies a submitted artist against the correct artist
        /// Returns verification results for each field (name, nationality, followers, start_date, last_release)
        /// </summary>
        [HttpPost("verify/artist/{artistId}")]
        public async Task<ActionResult<ArtistVerificationDTO>> VerifyArtist(Guid artistId, [FromBody] ArtistDTO submittedArtist)
        {
            if (submittedArtist == null)
                return BadRequest("Submitted artist data is required");

            try
            {
                var verification = await _service.VerifyArtist(artistId, submittedArtist);
                return Ok(verification);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Verifies a submitted album against the correct album
        /// Returns verification results for each field (name, artist, release_year, nb_stream)
        /// </summary>
        [HttpPost("verify/album/{albumId}")]
        public async Task<ActionResult<AlbumVerificationDTO>> VerifyAlbum(Guid albumId, [FromBody] AlbumDTO submittedAlbum)
        {
            if (submittedAlbum == null)
                return BadRequest("Submitted album data is required");

            try
            {
                var verification = await _service.VerifyAlbum(albumId, submittedAlbum);
                return Ok(verification);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Verifies submitted lyrics against the correct lyrics
        /// Returns verification results for each field (lyric, track)
        /// </summary>
        [HttpPost("verify/lyrics/{lyricsId}")]
        public async Task<ActionResult<LyricsVerificationDTO>> VerifyLyrics(Guid lyricsId, [FromBody] LyricsDTO submittedLyrics)
        {
            if (submittedLyrics == null)
                return BadRequest("Submitted lyrics data is required");

            try
            {
                var verification = await _service.VerifyLyrics(lyricsId, submittedLyrics);
                return Ok(verification);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Increments the Found counter for a game of the day
        /// Called when a user successfully completes a guess for today's game
        /// </summary>
        [HttpPut("game-day/{gameDayId}/increment-found")]
        public async Task<IActionResult> IncrementGameDayFound(int gameDayId)
        {
            var result = await _service.IncrementGameDayFoundAsync(gameDayId);
            if (!result)
                return NotFound($"Game day with id {gameDayId} not found");
            return Ok();
        }
    }
}
