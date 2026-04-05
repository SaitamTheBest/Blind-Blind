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
        /// <summary>
        /// Creates a new album using the specified album data.
        /// </summary>
        /// <remarks>This method is asynchronous and should be called with valid album data. The response
        /// includes a localized success message upon successful creation.</remarks>
        /// <param name="albumCrudDTO">An object containing the details of the album to create. This parameter must not be null.</param>
        /// <returns>An IActionResult that indicates the result of the operation. Returns a 200 OK response with a success
        /// message if the album is created successfully.</returns>
        [HttpPost("album")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> CreateAlbum([FromBody] AlbumCrudDTO albumCrudDTO)
        {
            await _service.CreateAlbum(albumCrudDTO);
            return Ok(new { message = "Album créé avec succès." });
        }
        /// <summary>
        /// Creates a new artist using the provided artist data.
        /// </summary>
        /// <remarks>This method is an HTTP POST endpoint intended to be called with a valid ArtistCrudDTO
        /// in the request body. The endpoint responds with a localized success message upon successful
        /// creation.</remarks>
        /// <param name="artistCrudDTO">An object containing the details of the artist to create. This parameter must not be null and should include
        /// all required artist information.</param>
        /// <returns>An IActionResult that indicates the result of the operation. Returns an HTTP 200 response with a success
        /// message if the artist is created successfully.</returns>
        [HttpPost("artist")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> CreateArtist([FromBody] ArtistCrudDTO artistCrudDTO)
        {
            await _service.CreateArtist(artistCrudDTO);
            return Ok(new { message = "Artiste créé avec succès." });
        }
        /// <summary>
        /// Creates a new track using the specified track data.
        /// </summary>
        /// <remarks>This method is an HTTP POST endpoint. The request body must provide valid track data
        /// that meets the required validation rules.</remarks>
        /// <param name="trackCrudDTO">An object containing the details of the track to create. This parameter must not be null and should include
        /// all required track information.</param>
        /// <returns>An IActionResult that indicates the result of the operation. Returns a success message if the track is
        /// created successfully.</returns>
        [HttpPost("track")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> CreateTrack([FromBody] TrackCrudDTO trackCrudDTO)
        {
            await _service.CreateTrack(trackCrudDTO);
            return Ok(new { message = "Track créée avec succès." });
        }
        /// <summary>
        /// Adds a collection of artist identifiers as featurings to the specified track.
        /// </summary>
        /// <remarks>This method processes a POST request to associate multiple artists as featurings with
        /// a given track. If an error occurs during the operation, the response will contain details about the
        /// failure.</remarks>
        /// <param name="trackId">The unique identifier of the track to which the featurings will be added. Cannot be null.</param>
        /// <param name="artistIds">A list of artist identifiers to add as featurings for the specified track. Cannot be null or empty.</param>
        /// <returns>An IActionResult that indicates the result of the operation. Returns a success message if the featurings are
        /// added successfully; otherwise, returns a bad request response with an error message.</returns>
        [HttpPost("track/{trackId}/featurings")]
        [Authorize(Policy = "AdminOnly")]
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
        /// <summary>
        /// Updates an existing album with the specified details.
        /// </summary>
        /// <remarks>Throws an ArgumentException if the provided album data is invalid. Ensure that all
        /// required fields in the albumCrudDTO are properly populated before calling this method.</remarks>
        /// <param name="albumCrudDTO">An object containing the updated information for the album. This parameter must not be null and should
        /// include all required album fields.</param>
        /// <returns>An IActionResult that indicates the result of the update operation. Returns an HTTP 200 response with a
        /// success message if the update is successful; otherwise, returns an HTTP 400 response with an error message.</returns>
        [HttpPut("album")]
        [Authorize(Policy = "AdminOnly")]
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
        /// <summary>
        /// Updates the details of an existing artist with the provided information.
        /// </summary>
        /// <remarks>Use this method with an HTTP PUT request to update artist information. If the
        /// provided data is invalid, the method returns a BadRequest with details about the error.</remarks>
        /// <param name="artistCrudDTO">An object containing the updated information for the artist. This parameter must include all required fields
        /// for the update operation and cannot be null.</param>
        /// <returns>An IActionResult that indicates the result of the update operation. Returns an HTTP 200 response with a
        /// success message if the update is successful; otherwise, returns an HTTP 400 response with an error message
        /// if the input is invalid.</returns>
        [HttpPut("artist")]
        [Authorize(Policy = "AdminOnly")]
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
        /// <summary>
        /// Updates the details of an existing track using the provided data transfer object.
        /// </summary>
        /// <remarks>This method handles HTTP PUT requests to update track information. An
        /// ArgumentException is returned as a bad request if the provided data is invalid.</remarks>
        /// <param name="trackCrudDTO">An object containing the updated track information. This parameter must not be null and should include all
        /// required fields for the update operation.</param>
        /// <returns>An IActionResult that indicates the outcome of the update operation. Returns an HTTP 200 response with a
        /// success message if the update is successful; otherwise, returns an HTTP 400 response with an error message.</returns>
        [HttpPut("track")]
        [Authorize(Policy = "AdminOnly")]
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
        /// <summary>
        /// Updates the list of featured artists associated with the specified track.
        /// </summary>
        /// <remarks>This method is an HTTP PUT endpoint. If the update operation fails, the response
        /// contains the error message in the body.</remarks>
        /// <param name="trackId">The unique identifier of the track for which the featured artists are to be updated. Cannot be null.</param>
        /// <param name="artistIds">A list of artist identifiers to associate as featured artists with the specified track. This list cannot be
        /// null or empty.</param>
        /// <returns>An IActionResult that indicates the result of the update operation. Returns a success message if the update
        /// is successful; otherwise, returns a bad request with an error message.</returns>
        [HttpPut("track/{trackId}/featurings")]
        [Authorize(Policy = "AdminOnly")]
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
        /// <summary>
        /// Deletes the album with the specified identifier.
        /// </summary>
        /// <remarks>Throws an ArgumentException if the provided album identifier is invalid.</remarks>
        /// <param name="id">The unique identifier of the album to delete. Cannot be null or empty.</param>
        /// <returns>An IActionResult that indicates the result of the delete operation. Returns a success message if the album
        /// is deleted; otherwise, returns a BadRequest with an error message.</returns>
        [HttpDelete("album/{id}")]
        [Authorize(Policy = "AdminOnly")]
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
        /// <summary>
        /// Deletes the artist with the specified identifier from the system.
        /// </summary>
        /// <remarks>This method is an HTTP DELETE endpoint that allows clients to remove an artist from
        /// the database. It handles exceptions related to invalid arguments and returns appropriate HTTP status
        /// codes.</remarks>
        /// <param name="id">The unique identifier of the artist to be deleted. This value cannot be null or empty.</param>
        /// <returns>An IActionResult indicating the result of the delete operation. Returns a success message if the artist is
        /// deleted successfully; otherwise, returns a BadRequest with an error message.</returns>
        [HttpDelete("artist/{id}")]
        [Authorize(Policy = "AdminOnly")]
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
        /// <summary>
        /// Deletes the track with the specified identifier.
        /// </summary>
        /// <remarks>Throws an <see cref="ArgumentException"/> if the provided identifier is
        /// invalid.</remarks>
        /// <param name="id">The unique identifier of the track to delete. Cannot be null or empty.</param>
        /// <returns>An <see cref="IActionResult"/> that indicates the result of the delete operation. Returns a success message
        /// if the track is deleted; otherwise, returns a bad request with an error message.</returns>
        [HttpDelete("track/{id}")]
        [Authorize(Policy = "AdminOnly")]
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
