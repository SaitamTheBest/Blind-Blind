using Blind_Blind_Backend.DTOs.DataGames;
using Blind_Blind_Backend.Services.DataGames;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Blind_Blind_Backend.Controllers.DataGames
{
    [ApiController]
    public class MusicSuggestionsController : ControllerBase
    {
        private readonly IMusicSuggestionsService _service;

        public MusicSuggestionsController(IMusicSuggestionsService service)
        {
            _service = service;
        }

        #region User Routes
        /// <summary>
        /// Creates a new music suggestion using the provided data transfer object.
        /// </summary>
        /// <remarks>This method requires the user to be authenticated. If the user is not authenticated,
        /// an Unauthorized response is returned.</remarks>
        /// <param name="dto">An object containing the details of the music suggestion to be created. Must not be null.</param>
        /// <returns>An IActionResult that represents the result of the operation. Returns an Ok result with the created
        /// suggestion if successful; otherwise, returns an Unauthorized result if the user is not authenticated.</returns>
        [Authorize]
        [HttpPost("api/music-suggestions")]
        public async Task<IActionResult> CreateSuggestion([FromBody] MusicSuggestionCreateDTO dto)
        {
            var userId = User.FindFirstValue("Id_User");
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Utilisateur non identifié.");

            var suggestion = await _service.CreateSuggestionAsync(userId, dto);
            return Ok(suggestion);
        }
        /// <summary>
        /// Retrieves a music suggestion for the specified user identifier.
        /// </summary>
        /// <remarks>This method requires the caller to be authenticated. If the user is not identified,
        /// the method returns an Unauthorized result. If no suggestion is found for the given user identifier, a
        /// NotFound result is returned.</remarks>
        /// <param name="id">The unique identifier of the user for whom the music suggestion is requested.</param>
        /// <returns>An IActionResult that contains the music suggestion if found; otherwise, a NotFound result if no suggestion
        /// exists, or an Unauthorized result if the user is not authenticated.</returns>
        [Authorize]
        [HttpGet("api/music-suggestions/me/{id}")]
        public async Task<IActionResult> GetUserSuggestion(int id)
        {
            var userId = User.FindFirstValue("Id_User");
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Utilisateur non identifié.");

            var suggestion = await _service.GetUserSuggestionAsync(id, userId);
            if (suggestion == null)
            {
                return NotFound("Suggestion introuvable.");
            }

            return Ok(suggestion);
        }
        #endregion

        #region Admin Routes
        /// <summary>
        /// Retrieves all music suggestions that are available to administrators.
        /// </summary>
        /// <remarks>This method requires the caller to have administrative privileges, as enforced by the
        /// 'AdminOnly' authorization policy.</remarks>
        /// <returns>An IActionResult containing a list of music suggestions. The list is empty if no suggestions are available.</returns>
        [Authorize(Policy = "AdminOnly")]
        [HttpGet("api/admin/music-suggestions")]
        public async Task<IActionResult> GetAllAdminSuggestions()
        {
            var suggestions = await _service.GetAllSuggestionsAdminAsync();
            return Ok(suggestions);
        }
        /// <summary>
        /// Accepts a pending music suggestion by its unique identifier, allowing an administrator to approve the
        /// suggestion.
        /// </summary>
        /// <remarks>This action requires administrator authorization and is accessible via a PATCH
        /// request. An ArgumentException is thrown if the specified suggestion identifier is invalid.</remarks>
        /// <param name="id_suggestion">The unique identifier of the music suggestion to accept. Must correspond to an existing suggestion.</param>
        /// <returns>An IActionResult that indicates the outcome of the operation. Returns a success message if the suggestion is
        /// accepted; returns a not found message if the suggestion does not exist.</returns>
        [Authorize(Policy = "AdminOnly")]
        [HttpPatch("api/admin/music-suggestions/{id_suggestion}/accept")]
        public async Task<IActionResult> AcceptSuggestion(int id_suggestion)
        {
            var adminId = User.FindFirstValue("Id_User");
            try
            {
                await _service.AcceptSuggestionAsync(id_suggestion, adminId!);
                return Ok(new { message = "Suggestion acceptée." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        /// <summary>
        /// Rejects a pending music suggestion identified by its unique identifier.
        /// </summary>
        /// <remarks>This action requires the caller to be authenticated and authorized with the
        /// 'AdminOnly' policy. An ArgumentException is thrown if the specified suggestion identifier is
        /// invalid.</remarks>
        /// <param name="id_suggestion">The unique identifier of the music suggestion to reject.</param>
        /// <returns>An IActionResult that indicates the result of the operation. Returns a success message if the suggestion is
        /// successfully rejected; otherwise, returns a not found message if the suggestion does not exist.</returns>
        [Authorize(Policy = "AdminOnly")]
        [HttpPatch("api/admin/music-suggestions/{id_suggestion}/reject")]
        public async Task<IActionResult> RejectSuggestion(int id_suggestion)
        {
            var adminId = User.FindFirstValue("Id_User");
            try
            {
                await _service.RejectSuggestionAsync(id_suggestion, adminId!);
                return Ok(new { message = "Suggestion rejetée." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        #endregion
    }
}
