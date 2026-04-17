using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.Repositories.DataUsers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blind_Blind_Backend.Controllers.DataUsers
{
    [ApiController]
    [Route("api/user-stats")]
    [AllowAnonymous]
    public class UserStatsController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserStatsController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        /// <summary>
        /// Récupère un résumé complet des statistiques utilisateurs
        /// Inclut le nombre total d'utilisateurs, de rangs, de rôles et de connexions
        /// </summary>
        /// <returns>Objet contenant toutes les statistiques utilisateurs</returns>
        [HttpGet]
        public async Task<ActionResult<UserDataStatsDTO>> GetUserStats()
        {
            try
            {
                var totalUsers = await _userRepository.GetTotalUsersAsync();
                var totalRanks = await _userRepository.GetTotalRanksAsync();
                var totalRoles = await _userRepository.GetTotalRolesAsync();
                var totalConnections = await _userRepository.GetTotalConnectionsAsync();

                var stats = new UserDataStatsDTO
                {
                    Total_Users = totalUsers,
                    Total_Ranks = totalRanks,
                    Total_Roles = totalRoles,
                    Total_Connections = totalConnections,
                    Generated_At = DateTime.UtcNow
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erreur lors de la récupération des statistiques utilisateurs: {ex.Message}" });
            }
        }
    }
}

