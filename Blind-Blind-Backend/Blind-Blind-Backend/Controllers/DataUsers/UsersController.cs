using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.Services.DataUsers;
using Microsoft.AspNetCore.Mvc;

namespace Blind_Blind_Backend.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Retrieves the user with the specified unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the user to retrieve.</param>
        /// <returns>An <see cref="IActionResult"/> containing the user data if found; otherwise, a NotFound result.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _userService.GetByIdAsync(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        /// <summary>
        /// Creates a new user with the specified information.
        /// </summary>
        /// <param name="userDTO">The user data to create. Must not be null.</param>
        /// <returns>A 201 Created response with a location header pointing to the newly created user resource.</returns>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserDTO userDTO)
        {
            await _userService.CreateAsync(userDTO);
            return CreatedAtAction(nameof(GetById), new { id = userDTO.Id_User }, null);
        }
    }
}
