using Blind_Blind_Backend.DTOs.DataGames;
using Blind_Blind_Backend.Services.DataGames;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blind_Blind_Backend.Controllers.DataGames
{
    [ApiController]
    [Route("api/music-stats")]
    [AllowAnonymous]
    public class MusicStatsController : ControllerBase
    {
        private readonly IStatsService _statsService;

        public MusicStatsController(IStatsService statsService)
        {
            _statsService = statsService;
        }

        /// <summary>
        /// Récupère un résumé complet des statistiques musicales
        /// Inclut le nombre total d'albums, d'artistes, de pistes et de jeux du jour
        /// </summary>
        /// <returns>Objet contenant toutes les statistiques musicales</returns>
        [HttpGet]
        public async Task<ActionResult<MusicDataStatsDTO>> GetMusicStats()
        {
            try
            {
                var stats = await _statsService.GetStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erreur lors de la récupération des statistiques musicales: {ex.Message}" });
            }
        }
    }
}
