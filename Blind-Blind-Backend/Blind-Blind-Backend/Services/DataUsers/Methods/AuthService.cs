using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.DTOs.General;
using Blind_Blind_Backend.Entities.DataUsers;
using Blind_Blind_Backend.Repositories.DataUsers;
using Blind_Blind_Backend.Services.General;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Blind_Blind_Backend.Services.DataUsers.Methods
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _config;
        private readonly SmtpClient _smtpClient;
        private readonly IGeneralService _generalService;
        private readonly JwtOptionsDTO _jwtOptions;
        private string? _logoBase64;

        public AuthService(IAuthRepository authRepository, IUserRepository userRepository, IOptions<JwtOptionsDTO> options,  IConfiguration config, IGeneralService generalService)
        {
            _authRepository = authRepository;
            _userRepository = userRepository;
            _config = config;
            _generalService = generalService;
            var smtp_host = Environment.GetEnvironmentVariable("SMTP_SERVER_HOST")!;
            var smtp_port = Environment.GetEnvironmentVariable("SMTP_SERVER_PORT")!;
            _smtpClient = new SmtpClient(smtp_host, int.Parse(smtp_port))
            {
                EnableSsl = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false
            };
            _jwtOptions = options.Value;

            // Charger le logo au démarrage
            _logoBase64 = LoadLogoAsBase64();

            if (string.IsNullOrEmpty(_logoBase64))
            {
                System.Diagnostics.Debug.WriteLine("⚠️ WARNING: Logo was not loaded. Password reset emails will use text fallback.");
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("✓ Logo successfully loaded for password reset emails");
            }
        }

        public async Task<AuthDTO?> LoginAsync(LoginDTO login)
        {
            var user = await _authRepository.GetAuthByEmailAsync(login.Email);

            if (user == null)
                return null;

            if (!_generalService.VerifyPassword(user.Password, login.Password))
                return null;

            var accessToken = GenerateAccessToken(user);
            var refreshToken = GenerateRefreshToken();

            var expiration = login.RememberMe
                ? DateTime.UtcNow.AddDays(30)
                : DateTime.UtcNow.AddDays(1);

            var hashedToken = HashRefreshToken(refreshToken);

            await _authRepository.SaveRefreshTokenAsync(new RefreshToken
            {
                Token = hashedToken,
                Id_User = user.Id_User,
                ExpirationDate = expiration,
                CreatedAt = DateTime.UtcNow
            });

            return new AuthDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        public async Task<AuthDTO?> RefreshTokenAsync(string refreshToken)
        {
            var hashedToken = HashRefreshToken(refreshToken);

            var storedToken = await _authRepository.GetRefreshTokenAsync(hashedToken);

            if (storedToken == null || storedToken.IsRevoked || storedToken.ExpirationDate < DateTime.UtcNow)
                return null;

            var user = await _authRepository.GetUserByIdAsync(storedToken.Id_User);

            storedToken.IsRevoked = true;
            await _authRepository.UpdateRefreshTokenAsync(storedToken);

            var newRefreshToken = GenerateRefreshToken();
            var hashedNewToken = HashRefreshToken(newRefreshToken);
            var newExpiration = DateTime.UtcNow.AddDays(30);

            await _authRepository.SaveRefreshTokenAsync(new RefreshToken
            {
                Token = hashedNewToken,
                Id_User = user.Id_User,
                ExpirationDate = newExpiration,
                CreatedAt = DateTime.UtcNow
            });

            var newAccessToken = GenerateAccessToken(user);

            return new AuthDTO
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };
        }

        public async Task RevokeRefreshTokenAsync(string refreshToken)
        {
            var hashedToken = HashRefreshToken(refreshToken);

            var token = await _authRepository.GetRefreshTokenAsync(hashedToken);

            if (token != null)
            {
                token.IsRevoked = true;
                await _authRepository.UpdateRefreshTokenAsync(token);
            }
        }

        public async Task RequestPasswordResetAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) return;

            var token = Guid.NewGuid().ToString();

            user.ResetToken = token;
            user.ResetTokenExpiration = DateTime.UtcNow.AddHours(1);

            await _userRepository.UpdateUserAsync(user);

            var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL");
            var resetLink = $"{frontendUrl}/reset-password?token={token}";
            var expirationTime = DateTime.UtcNow.AddHours(1).ToString("dd/MM/yyyy HH:mm:ss");

            var emailBody = GeneratePasswordResetEmailBody(
                user.Username,
                resetLink,
                expirationTime,
                email
            );

            var message = new MailMessage
            {
                From = new MailAddress("no-reply@blindblind.fr", "Blind-Blind"),
                Subject = "Réinitialisation du mot de passe - Blind-Blind",
                Body = emailBody,
                IsBodyHtml = true
            };

            message.To.Add(email);

            await _smtpClient.SendMailAsync(message);
        }

        public async Task ResetPasswordAsync(string token, string newPassword)
        {
            if (string.IsNullOrWhiteSpace(token))
                throw new ArgumentException("Le token de réinitialisation est requis.", nameof(token));

            if (string.IsNullOrWhiteSpace(newPassword))
                throw new ArgumentException("Le nouveau mot de passe est requis.", nameof(newPassword));

            if (newPassword.Length < 8)
                throw new ArgumentException("Le mot de passe doit contenir au moins 8 caractères.", nameof(newPassword));

            var user = await _authRepository.GetUserByResetTokenAsync(token);
            if (user == null)
                throw new InvalidOperationException("Token de réinitialisation invalide ou expiré.");

            if (user.ResetTokenExpiration == null || user.ResetTokenExpiration < DateTime.UtcNow)
                throw new InvalidOperationException("Le token a expiré. Demande une nouvelle réinitialisation.");

            var connection = await _userRepository.GetConnectionBlindBlindByIdAsync(user.Id_User);
            if (connection == null)
                throw new InvalidOperationException("Compte utilisateur introuvable.");

            // Vérifier que le nouveau mot de passe n'est pas le même que l'ancien
            if (_generalService.VerifyPassword(connection.Password, newPassword))
                throw new InvalidOperationException("Le nouveau mot de passe ne peut pas être identique à l'ancien.");

            connection.Password = _generalService.HashPassword(newPassword);
            user.ResetToken = null;
            user.ResetTokenExpiration = null;

            await _userRepository.UpdateUserAsync(user);
            await _userRepository.UpdateConnectionBlindBlindAsync(connection);
        }

        #region Private
        private string GeneratePasswordResetEmailBody(string username, string resetLink, string expirationTime, string email)
        {
            // Utiliser une image par défaut si le logo n'est pas chargé
            string logoHtml = string.IsNullOrEmpty(_logoBase64)
                ? "<div class='logo'>Blind-Blind</div>"
                : $"<img src='data:image/png;base64,{_logoBase64}' alt='Blind-Blind Logo' style='max-width: 150px; height: auto; margin-bottom: 10px;'>";

            return $@"
<!DOCTYPE html>
<html lang='fr'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            padding: 30px;
            text-align: center;
            color: #ffffff;
        }}
        .logo {{
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }}
        .header-subtitle {{
            font-size: 13px;
            opacity: 0.9;
            margin-top: 10px;
        }}
        .content {{
            padding: 40px 30px;
        }}
        .greeting {{
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #000000;
        }}
        .reset-button {{
            display: inline-block;
            background-color: #000000;
            color: #ffffff;
            padding: 14px 40px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            margin: 25px 0;
            text-align: center;
            transition: background-color 0.3s ease;
        }}
        .reset-button:hover {{
            background-color: #333333;
        }}
        .info-box {{
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }}
        .info-box h3 {{
            color: #000000;
            font-size: 14px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        .info-box p {{
            font-size: 13px;
            margin: 8px 0;
            color: #555;
        }}
        .expiration-warning {{
            background-color: #fff3cd;
            border-left: 4px solid #ff9800;
            padding: 12px;
            margin: 15px 0;
            border-radius: 4px;
            font-size: 13px;
        }}
        .footer {{
            background-color: #f5f5f5;
            padding: 30px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
        }}
        .footer p {{
            margin: 8px 0;
        }}
        .divider {{
            height: 1px;
            background-color: #e0e0e0;
            margin: 20px 0;
        }}
        .warning {{
            color: #d32f2f;
            font-weight: 600;
        }}
        .safe {{
            color: #388e3c;
            font-weight: 600;
        }}
        .button-wrapper {{
            text-align: center;
        }}
    </style>
</head>
<body>
    <div class='container'>
        <!-- Header with Logo -->
        <div class='header'>
            {logoHtml}
        </div>

        <!-- Main Content -->
        <div class='content'>
            <!-- Greeting -->
            <div class='greeting'>
                Bonjour {username},
            </div>

            <p>Tu as demandé une réinitialisation de ton mot de passe Blind-Blind. Clique sur le bouton ci-dessous pour continuer :</p>

            <!-- Reset Button -->
            <div class='button-wrapper'>
                <a href='{resetLink}' class='reset-button'>Réinitialiser mon mot de passe</a>
            </div>

            <!-- Information Box -->
            <div class='info-box'>
                <h3>Informations de sécurité</h3>
                <p><strong>Adresse email associée :</strong> {email}</p>
                <p><strong>Demande reçue le :</strong> {DateTime.UtcNow:dd/MM/yyyy HH:mm:ss} UTC</p>
                <p><strong>Expire le :</strong> {expirationTime} UTC</p>
            </div>

            <!-- Expiration Warning -->
            <div class='expiration-warning'>
                <strong>Attention !</strong> Ce lien ne reste valide que <strong>1 heure</strong>. Après ce délai, tu devras demander une nouvelle réinitialisation.
            </div>

            <div class='divider'></div>

            <!-- What to do next -->
            <h3 style='color: #000; margin-top: 20px; margin-bottom: 10px;'>Prochaines étapes :</h3>
            <ol style='margin-left: 20px; font-size: 14px;'>
                <li>Clique sur le bouton ci-dessus</li>
                <li>Saisis ton nouveau mot de passe</li>
                <li>Assure-toi que ton nouveau mot de passe est <strong>sécurisé</strong> (au moins 8 caractères)</li>
                <li>Clique sur ""Réinitialiser"" pour valider</li>
            </ol>

            <div class='divider'></div>

            <!-- Did not request this -->
            <p style='margin-top: 20px; font-size: 13px;'>
                <strong>Tu n'as pas demandé cette réinitialisation ?</strong>
            </p>
            <p style='font-size: 13px; color: #555;'>
                Si tu n'es pas à l'origine de cette demande, <span class='safe'>ne clique pas sur le lien</span> et <strong>ignore simplement cet email</strong>. 
                Ton compte reste sécurisé. Si tu suspectes une activité malveillante, contacte notre équipe support.
            </p>
        </div>

        <!-- Footer -->
        <div class='footer'>
            <p><strong>Blind-Blind</strong></p>
            <p style='margin-top: 15px; opacity: 0.7;'>Plateforme de jeu musical communautaire</p>
            <p style='margin-top: 15px; opacity: 0.7;'>Cet email a été envoyé à {email}</p>
            <p style='margin-top: 10px; opacity: 0.7;'>© 2026 Blind-Blind. Tous droits réservés.</p>
            <p style='margin-top: 15px; font-size: 11px; opacity: 0.6;'>Ne réponds pas à cet email automatique</p>
        </div>
    </div>
</body>
</html>
";
        }

        private string? LoadLogoAsBase64()
        {
            try
            {
                // Liste des chemins possibles à essayer
                var possiblePaths = new[]
                {
                    // Chemin 1: Depuis AppDomain BaseDirectory
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Ressources", "Blind-Blind-logo-blanc.png"),

                    // Chemin 2: Depuis le répertoire courant
                    Path.Combine(Directory.GetCurrentDirectory(), "Ressources", "Blind-Blind-logo-blanc.png"),

                    // Chemin 3: Depuis le répertoire parent (bin -> ..)
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "Ressources", "Blind-Blind-logo-blanc.png"),

                    // Chemin 4: Depuis le répertoire du projet
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "bin", "Debug", "net10.0", "Ressources", "Blind-Blind-logo-blanc.png"),

                    // Chemin 5: Chemin absolu depuis wwwroot
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot", "Ressources", "Blind-Blind-logo-blanc.png"),
                };

                // Essayer chaque chemin
                foreach (var logoPath in possiblePaths)
                {
                    var fullPath = Path.GetFullPath(logoPath);
                    System.Diagnostics.Debug.WriteLine($"Trying logo path: {fullPath}");

                    if (File.Exists(fullPath))
                    {
                        System.Diagnostics.Debug.WriteLine($"Logo found at: {fullPath}");
                        var imageBytes = File.ReadAllBytes(fullPath);
                        var base64 = Convert.ToBase64String(imageBytes);
                        System.Diagnostics.Debug.WriteLine($"Logo successfully loaded, size: {base64.Length} bytes (base64)");
                        return base64;
                    }
                    else
                    {
                        System.Diagnostics.Debug.WriteLine($"Logo not found at: {fullPath}");
                    }
                }

                // Si aucun chemin ne fonctionne, essayer de trouver le fichier manuellement
                System.Diagnostics.Debug.WriteLine("Logo file not found in any standard paths. Searching in directory structure...");
                var ressourcesDir = Directory.GetDirectories(AppDomain.CurrentDomain.BaseDirectory, "Ressources", SearchOption.AllDirectories).FirstOrDefault();

                if (ressourcesDir != null)
                {
                    var logoFile = Path.Combine(ressourcesDir, "Blind-Blind-logo-blanc.png");
                    System.Diagnostics.Debug.WriteLine($"Found Ressources directory at: {ressourcesDir}");
                    System.Diagnostics.Debug.WriteLine($"Looking for logo at: {logoFile}");

                    if (File.Exists(logoFile))
                    {
                        System.Diagnostics.Debug.WriteLine($"Logo found at: {logoFile}");
                        var imageBytes = File.ReadAllBytes(logoFile);
                        var base64 = Convert.ToBase64String(imageBytes);
                        System.Diagnostics.Debug.WriteLine($"Logo successfully loaded, size: {base64.Length} bytes (base64)");
                        return base64;
                    }
                }

                System.Diagnostics.Debug.WriteLine("ERROR: Unable to find Blind-Blind-logo-blanc.png file in any location");
                System.Diagnostics.Debug.WriteLine($"Base directory: {AppDomain.CurrentDomain.BaseDirectory}");
                System.Diagnostics.Debug.WriteLine($"Current directory: {Directory.GetCurrentDirectory()}");

                return null;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading logo: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Stack trace: {ex.StackTrace}");
                return null;
            }
        }

        private string GenerateAccessToken(ConnectionBlindBlind user)
        {
            var claims = new[]
            {
                new Claim("Id_User", user.Id_User),
                new Claim("Email", user.Email),
                new Claim("Role", user.User.Roles.Role_Name),
                new Claim("Name", user.User.Username),
                new Claim("Avatar", user.User.Avatar.ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_jwtOptions.Key)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];

            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);

            return Convert.ToBase64String(randomBytes);
        }

        private string HashRefreshToken(string token)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(token));
            return Convert.ToBase64String(bytes);
        }
    }
    #endregion
}
