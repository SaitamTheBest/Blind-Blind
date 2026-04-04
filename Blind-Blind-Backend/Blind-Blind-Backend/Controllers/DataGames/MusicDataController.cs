using Blind_Blind_Backend.DTOs.DataGames;
using Blind_Blind_Backend.Services.DataGames;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blind_Blind_Backend.Controllers.DataGames
{
    //[Authorize(Policy = "AdminOnly")] // or [Authorize]
    [Authorize]
    [ApiController]
    [Route("api/music-data")]
    public class MusicDataController : ControllerBase
    {
        private readonly IMusicDataService _service;
        public MusicDataController(IMusicDataService service)
        {
            _service = service;
        }

        #region CREATE
        [HttpPost("album")]
        public async Task<IActionResult> CreateAlbum([FromBody] AlbumCrudDTO albumCrudDTO)
        {
            await _service.CreateAlbum(albumCrudDTO);
            return Ok(new { message = "Album créé avec succès." });
        }

        [HttpPost("artist")]
        public async Task<IActionResult> CreateArtist([FromBody] ArtistCrudDTO artistCrudDTO)
        {
            await _service.CreateArtist(artistCrudDTO);
            return Ok(new { message = "Artiste créé avec succès." });
        }

        [HttpPost("track")]
        public async Task<IActionResult> CreateTrack([FromBody] TrackCrudDTO trackCrudDTO)
        {
            await _service.CreateTrack(trackCrudDTO);
            return Ok(new { message = "Track créée avec succès." });
        }

        [HttpPost("track/{trackId}/featurings")]
        public async Task<IActionResult> AddFeaturingsToTrack(string trackId, [FromBody] List<string> artistIds)
        {
            try
            {
                await _service.AddFeaturingsToTrack(trackId, artistIds);
                return Ok(new { message = "Featurings ajoutés avec succès." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region UPDATE
        [HttpPut("album")]
        public async Task<IActionResult> UpdateAlbum([FromBody] AlbumCrudDTO albumCrudDTO)
        {
            try
            {
                await _service.UpdateAlbum(albumCrudDTO);
                return Ok(new { message = "Album mis à jour avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("artist")]
        public async Task<IActionResult> UpdateArtist([FromBody] ArtistCrudDTO artistCrudDTO)
        {
            try
            {
                await _service.UpdateArtist(artistCrudDTO);
                return Ok(new { message = "Artiste mis à jour avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("track")]
        public async Task<IActionResult> UpdateTrack([FromBody] TrackCrudDTO trackCrudDTO)
        {
            try
            {
                await _service.UpdateTrack(trackCrudDTO);
                return Ok(new { message = "Track mise à jour avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("track/{trackId}/featurings")]
        public async Task<IActionResult> UpdateFeaturingsForTrack(string trackId, [FromBody] List<string> artistIds)
        {
            try
            {
                await _service.UpdateFeaturingsForTrack(trackId, artistIds);
                return Ok(new { message = "Featurings mis à jour avec succès." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region DELETE
        [HttpDelete("album/{id}")]
        public async Task<IActionResult> DeleteAlbum(string id)
        {
            try
            {
                await _service.DeleteAlbum(id);
                return Ok(new { message = "Album supprimé avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("artist/{id}")]
        public async Task<IActionResult> DeleteArtist(string id)
        {
            try
            {
                await _service.DeleteArtist(id);
                return Ok(new { message = "Artiste supprimé avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("track/{id}")]
        public async Task<IActionResult> DeleteTrack(string id)
        {
            try
            {
                await _service.DeleteTrack(id);
                return Ok(new { message = "Track supprimée avec succès." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion
    }
}
