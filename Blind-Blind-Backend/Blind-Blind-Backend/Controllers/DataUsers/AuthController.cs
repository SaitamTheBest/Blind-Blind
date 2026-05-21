using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.Services.DataUsers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blind_Blind_Backend.Controllers.DataUsers
{
    [Authorize]
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
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
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO login)
        {
            var result = await _authService.LoginAsync(login);

            if (result == null)
                return Unauthorized("Invalid credentials");

            return Ok(result);
        }

        /// <summary>
        /// Refreshes the authentication token using the specified refresh token.
        /// </summary>
        /// <remarks>Use this method to obtain a new authentication token without requiring the user to
        /// log in again. Ensure that the provided refresh token is valid and has not expired.</remarks>
        /// <param name="refreshToken">A data transfer object containing the refresh token to be validated and used for generating a new
        /// authentication token. Cannot be null.</param>
        /// <returns>An <see cref="IActionResult"/> that represents the result of the refresh operation. Returns 200 OK with the
        /// new authentication token if the refresh is successful; otherwise, returns 401 Unauthorized if the refresh
        /// token is invalid or expired.</returns>
        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenDTO refreshToken)
        {
            var auth = await _authService.RefreshTokenAsync(refreshToken.RefreshToken);

            if (auth == null)
                return Unauthorized();

            return Ok(auth);
        }

        /// <summary>
        /// Logs out the user by revoking the specified refresh token.
        /// </summary>
        /// <remarks>Call this method to terminate a user's session and invalidate their refresh token.
        /// This helps ensure that the user cannot obtain new access tokens using the revoked refresh token.</remarks>
        /// <param name="refreshToken">The refresh token to revoke. This value must not be null.</param>
        /// <returns>An IActionResult that indicates the result of the logout operation. Returns Ok() if the refresh token is
        /// successfully revoked.</returns>
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] string refreshToken)
        {
            await _authService.RevokeRefreshTokenAsync(refreshToken);
            return Ok();
        }

        /// <summary>
        /// Initiates the password reset process for a user by sending a password reset link to the specified email
        /// address.
        /// </summary>
        /// <remarks>For security, the response does not reveal whether the email address is registered.
        /// This prevents attackers from discovering valid user accounts.</remarks>
        /// <param name="dto">An object containing the email address of the user requesting a password reset. The email must be valid and
        /// associated with an existing account.</param>
        /// <returns>An IActionResult indicating the outcome of the request. Returns a success message regardless of whether the
        /// email exists for security reasons.</returns>
        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO dto)
        {
            await _authService.RequestPasswordResetAsync(dto.Email);
            return Ok(new { message = "If email exists, reset link sent" });
        }

        /// <summary>
        /// Resets a user's password using the provided reset token and new password.
        /// </summary>
        /// <remarks>This endpoint is typically used as part of a password recovery workflow. The reset
        /// token is usually obtained by the user via email or another secure channel.</remarks>
        /// <param name="dto">An object containing the password reset token and the new password to set. The token must be valid and the
        /// new password must meet the application's password requirements.</param>
        /// <returns>An HTTP 200 response indicating that the password was successfully updated.</returns>
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
        {
            await _authService.ResetPasswordAsync(dto.Token, dto.NewPassword);
            return Ok(new { message = "Password updated" });
        }
    }
}
