using Blind_Blind_Backend.DTOs.DataAdmin;
using Blind_Blind_Backend.Services.DataAdmin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Blind_Blind_Backend.Controllers.DataAdmin
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly IAnnouncementService _announcementService;
        private readonly IAnnouncement_TypeService _announcementTypeService;

        public AdminController(IAnnouncementService announcementService, IAnnouncement_TypeService announcementTypeService)
        {
            _announcementService = announcementService;
            _announcementTypeService = announcementTypeService;
        }

        /// <summary>
        /// Récupère toutes les annonces
        /// </summary>
        /// <returns>Liste de toutes les annonces</returns>
        [HttpGet("announcements")]
        [AllowAnonymous]
        public async Task<ActionResult<IReadOnlyList<AnnouncementDTO>>> GetAllAnnouncements()
        {
            try
            {
                var announcements = await _announcementService.GetAllAsync();
                return Ok(announcements);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erreur lors de la récupération des annonces: {ex.Message}" });
            }
        }

        /// <summary>
        /// Récupère une annonce par son ID
        /// </summary>
        /// <param name="id">ID de l'annonce</param>
        /// <returns>Détails de l'annonce</returns>
        [HttpGet("announcements/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<AnnouncementDTO>> GetAnnouncementById(int id)
        {
            try
            {
                var announcement = await _announcementService.GetByIdAsync(id);
                if (announcement == null)
                {
                    return NotFound(new { message = "Annonce non trouvée" });
                }
                return Ok(announcement);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erreur lors de la récupération de l'annonce: {ex.Message}" });
            }
        }

        /// <summary>
        /// Crée une nouvelle annonce (admin uniquement)
        /// </summary>
        /// <param name="announcementCreateDTO">Détails de l'annonce à créer</param>
        /// <returns>Annonce créée</returns>
        [HttpPost("announcements")]
        [Authorize(Policy = "AdminOnly")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<AnnouncementDTO>> CreateAnnouncement([FromForm] AnnouncementCreateDTO announcementCreateDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Utilisateur non identifié" });
                }

                var announcement = await _announcementService.CreateAsync(announcementCreateDTO, userId);
                return CreatedAtAction(nameof(GetAnnouncementById), new { id = announcement.Id_Announcement }, announcement);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erreur lors de la création de l'annonce: {ex.Message}" });
            }
        }

        /// <summary>
        /// Met à jour une annonce existante (admin uniquement)
        /// </summary>
        /// <param name="id">ID de l'annonce à mettre à jour</param>
        /// <param name="announcementUpdateDTO">Détails mis à jour de l'annonce</param>
        /// <returns>Annonce mise à jour</returns>
        [HttpPut("announcements/{id}")]
        [Authorize(Policy = "AdminOnly")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<AnnouncementDTO>> UpdateAnnouncement(int id, [FromForm] AnnouncementUpdateDTO announcementUpdateDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var announcement = await _announcementService.UpdateAsync(id, announcementUpdateDTO);
                return Ok(announcement);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Annonce non trouvée" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erreur lors de la mise à jour de l'annonce: {ex.Message}" });
            }
        }

        /// <summary>
        /// Supprime une annonce (admin uniquement)
        /// </summary>
        /// <param name="id">ID de l'annonce à supprimer</param>
        /// <returns>Pas de contenu</returns>
        [HttpDelete("announcements/{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> DeleteAnnouncement(int id)
        {
            try
            {
                var announcement = await _announcementService.GetByIdAsync(id);
                if (announcement == null)
                {
                    return NotFound(new { message = "Annonce non trouvée" });
                }

                await _announcementService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erreur lors de la suppression de l'annonce: {ex.Message}" });
            }
        }

        #region Announcement Types Management

        /// <summary>
        /// Récupère tous les types d'annonces
        /// </summary>
        /// <returns>Liste de tous les types d'annonces</returns>
        [HttpGet("announcement-types")]
        [AllowAnonymous]
        public async Task<ActionResult<IReadOnlyList<Announcement_TypeDTO>>> GetAllAnnouncementTypes()
        {
            try
            {
                var announcementTypes = await _announcementTypeService.GetAllAsync();
                return Ok(announcementTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erreur lors de la récupération des types d'annonces: {ex.Message}" });
            }
        }

        /// <summary>
        /// Récupère un type d'annonce par son ID
        /// </summary>
        /// <param name="id">ID du type d'annonce</param>
        /// <returns>Détails du type d'annonce</returns>
        [HttpGet("announcement-types/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Announcement_TypeDTO>> GetAnnouncementTypeById(int id)
        {
            try
            {
                var announcementType = await _announcementTypeService.GetByIdAsync(id);
                if (announcementType == null)
                {
                    return NotFound(new { message = "Type d'annonce non trouvé" });
                }
                return Ok(announcementType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erreur lors de la récupération du type d'annonce: {ex.Message}" });
            }
        }

        /// <summary>
        /// Crée un nouveau type d'annonce (admin uniquement)
        /// </summary>
        /// <param name="announcementTypeCreateDTO">Détails du type d'annonce à créer</param>
        /// <returns>Type d'annonce créé</returns>
        [HttpPost("announcement-types")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<Announcement_TypeDTO>> CreateAnnouncementType([FromBody] Announcement_TypeCreateDTO announcementTypeCreateDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var announcementType = await _announcementTypeService.CreateAsync(announcementTypeCreateDTO);
                return CreatedAtAction(nameof(GetAnnouncementTypeById), new { id = announcementType.Id_Announcement_Type }, announcementType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erreur lors de la création du type d'annonce: {ex.Message}" });
            }
        }

        /// <summary>
        /// Met à jour un type d'annonce existant (admin uniquement)
        /// </summary>
        /// <param name="id">ID du type d'annonce à mettre à jour</param>
        /// <param name="announcementTypeUpdateDTO">Détails mis à jour du type d'annonce</param>
        /// <returns>Type d'annonce mis à jour</returns>
        [HttpPut("announcement-types/{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<Announcement_TypeDTO>> UpdateAnnouncementType(int id, [FromBody] Announcement_TypeUpdateDTO announcementTypeUpdateDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var announcementType = await _announcementTypeService.UpdateAsync(id, announcementTypeUpdateDTO);
                return Ok(announcementType);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Type d'annonce non trouvé" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erreur lors de la mise à jour du type d'annonce: {ex.Message}" });
            }
        }

        #endregion
    }
}