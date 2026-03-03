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

        [HttpGet("get-all-albums")]
        public async Task<ActionResult<List<AlbumDTO>>> GetAllAlbums()
        {
            var albums = await _service.GetAllAlbums();
            return Ok(albums);
        }

        [HttpGet("get-all-artists")]
        public async Task<ActionResult<List<ArtistDTO>>> GetAllArtists()
        {
            var artists = await _service.GetAllArtists();
            return Ok(artists);
        }

        [HttpGet("get-all-tracks")]
        public async Task<ActionResult<List<TrackDTO>>> GetAllTracks()
        {
            var tracks = await _service.GetAllTracks();
            return Ok(tracks);
        }

        [HttpGet("get-album-by-id/{id}")]
        public async Task<ActionResult<AlbumDTO>> GetAlbumById(string id)
        {
            var album = await _service.GetAlbumById(id);
            if (album == null)
                return NotFound();
            return Ok(album);
        }

        [HttpGet("get-artist-by-id/{id}")]
        public async Task<ActionResult<ArtistDTO>> GetArtistById(string id)
        {
            var artist = await _service.GetArtistById(id);
            if (artist == null)
                return NotFound();
            return Ok(artist);
        }

        [HttpGet("get-track-by-id/{id}")]
        public async Task<ActionResult<TrackDTO>> GetTrackById(string id)
        {
            var track = await _service.GetTrackById(id);
            if (track == null)
                return NotFound();
            return Ok(track);
        }
    }
}
