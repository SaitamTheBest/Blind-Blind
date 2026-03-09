using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.Services.DataUsers.Methods;
using Microsoft.AspNetCore.Mvc;

namespace Blind_Blind_Backend.Controllers.DataUsers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Authenticates a user based on the provided credentials and returns an authentication token if the
        /// credentials are valid.
        /// </summary>
        /// <remarks>This method is intended to be called via an HTTP POST request. Ensure that the
        /// provided credentials are correct to receive a valid token.</remarks>
        /// <param name="login">The credentials used for authentication, including username and password. Cannot be null.</param>
        /// <returns>An IActionResult containing the authentication token if authentication is successful; otherwise, an
        /// Unauthorized result indicating invalid credentials.</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login(ConnectionBlindBlindDTO login)
        {
            var result = await _authService.LoginAsync(login);

            if (result == null)
                return Unauthorized("Invalid credentials");

            return Ok(result);
        }
    }
}
