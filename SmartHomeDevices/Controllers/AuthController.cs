using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHomeDevices.Data;
using SmartHomeDevices.Models;
using SmartHomeDevices.Services;

namespace SmartHomeDevices.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            Console.WriteLine($"Inscription de : {request.Email}");

            if (!ModelState.IsValid)
            {
                Console.WriteLine(" ModelState invalide");
                return BadRequest(ModelState);
            }

            // Vérifier si l'email existe déjà
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                Console.WriteLine(" Email déjà utilisé");
                return BadRequest(new { message = "Cet email est déjà utilisé" });
            }

            // Hasher le mot de passe
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            Console.WriteLine($" Hash généré : {hashedPassword}");
            Console.WriteLine($"Longueur du hash : {hashedPassword.Length}");

            // Créer l'utilisateur
            var user = new User
            {
                Email = request.Email,
                Password = hashedPassword,
                Name = request.Name,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Utilisateur créé avec ID : {user.Id}");

            return Ok(new
            {
                message = "Utilisateur créé avec succès",
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    name = user.Name
                }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            Console.WriteLine($"\n ========== TENTATIVE DE CONNEXION ==========");
            Console.WriteLine($" Email : {request.Email}");
            Console.WriteLine($"Mot de passe saisi : {request.Password}");

            if (!ModelState.IsValid)
            {
                Console.WriteLine(" ModelState invalide");
                return BadRequest(ModelState);
            }

            // Chercher l'utilisateur
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                Console.WriteLine(" Utilisateur introuvable dans la base de données");
                return Unauthorized(new { error = "Email ou mot de passe incorrect" });
            }

            Console.WriteLine($"Utilisateur trouvé : {user.Email}");
            Console.WriteLine($" Hash stocké dans la DB : {user.Password}");
            Console.WriteLine($"Longueur du hash stocké : {user.Password.Length}");

            // Vérifier le mot de passe
            try
            {
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
                Console.WriteLine($" Mot de passe valide ? {isPasswordValid}");

                if (!isPasswordValid)
                {
                    Console.WriteLine(" Mot de passe incorrect");
                    return Unauthorized(new { error = "Email ou mot de passe incorrect" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($" Erreur lors de la vérification du mot de passe : {ex.Message}");
                return Unauthorized(new { error = "Email ou mot de passe incorrect" });
            }

            // Générer le token JWT
            var token = _jwtService.GenerateToken(user);
            Console.WriteLine(" Token généré avec succès");
            Console.WriteLine($"========== FIN CONNEXION ==========\n");

            return Ok(new
            {
                token,
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    name = user.Name
                }
            });
        }
    }

    // Classes de requêtes
    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}