using Blind_Blind_Backend.DTOs.DataGames;
using Blind_Blind_Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blind_Blind_Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/game-management")]
    [Tags("Game Management")]
    public class GameManagementController : ControllerBase
    {
        private readonly IGameManagementService _service;

        public GameManagementController(IGameManagementService service)
        {
            _service = service;
        }

        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] GameCreateDTO dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = created.Id_Game },
                    created
                );
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] GameUpdateDTO dto)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, dto);

                if (updated == null)
                    return NotFound();

                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);

            if (!result)
                return NotFound();

            return Ok();
        }
    }
}