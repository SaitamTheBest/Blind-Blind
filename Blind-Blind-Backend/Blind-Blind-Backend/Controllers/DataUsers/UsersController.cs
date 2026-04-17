using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.Services.DataUsers;
using Blind_Blind_Backend.Entities.DataUsers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Blind_Blind_Backend.Controllers
{
    [Authorize]
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
        [AllowAnonymous]
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _userService.GetByIdAsync(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        /// <summary>
        /// Retrieves all users available in the system.
        /// </summary>
        /// <remarks>This endpoint is only accessible to administrators.</remarks>
        /// <returns>An <see cref="IActionResult"/> containing a list of <see cref="UserDTO"/> objects representing all users.</returns>
        [Authorize(Policy = "AdminOnly")]
        [HttpGet("all")]
        [ProducesResponseType(typeof(List<UserDTO>), 200)]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        /// <summary>
        /// Creates a new user with the specified information.
        /// </summary>
        /// <param name="userDTO">The user data to create. Must not be null.</param>
        /// <returns>A 201 Created response with a location header pointing to the newly created user resource.</returns>
        [AllowAnonymous]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] ConnectionBlindBlindCreateDTO connectionBlindBlindDTO)
        {

            User createdUser = await _userService.CreateUserAsync(connectionBlindBlindDTO.User);
            connectionBlindBlindDTO.Id_User = createdUser.Id_User;
            await _userService.CreateConnectionBlindBlind(connectionBlindBlindDTO);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdUser.Id_User },
                createdUser
            );
        }

        /// <summary>
        /// Updates the user information with the values provided in the specified data transfer object.
        /// </summary>
        /// <remarks>This method is asynchronous and may return a BadRequest if validation fails or an
        /// exception occurs during the update process. Ensure that the input data is properly validated before calling
        /// this method.</remarks>
        /// <param name="userUpdateDTO">The data transfer object containing the updated user information. Must include all required fields for the
        /// update operation and be valid according to the application's user model.</param>
        /// <returns>An IActionResult that indicates the outcome of the update operation. Returns Ok if the update is successful;
        /// otherwise, returns BadRequest with an error message.</returns>
        [Authorize(Policy = "OwnerOrAdmin")]
        [HttpPost("update/{id}")]
        public async Task<IActionResult> Update(string id, [FromForm] UserUpdateDTO userUpdateDTO)
        {
            try
            {
                userUpdateDTO.Id_User = id;
                await _userService.UpdateUserAsync(userUpdateDTO);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [Authorize(Policy = "OwnerOrAdmin")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
