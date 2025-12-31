using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHomeDevices.Data;
using SmartHomeDevices.Models;
using System.Security.Claims;

namespace SmartHomeDevices.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DevicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DevicesController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim!);
        }

        // GET: api/equipement
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Device>>> GetDevices()
        {
            var userId = GetUserId();
            var devices = await _context.Devices
                .Where(d => d.UserId == userId)
                .ToListAsync();

            return Ok(devices);
        }

        // GET: api/equipement/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Device>> GetDevice(int id)
        {
            var userId = GetUserId();
            var device = await _context.Devices
                .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

            if (device == null)
            {
                return NotFound(new { message = "Device non trouvé" });
            }

            return Ok(device);
        }

        // POST: api/equipement
        [HttpPost]
        public async Task<ActionResult<Device>> CreateDevice([FromBody] Device device)
        {
            var userId = GetUserId();

            device.UserId = userId;
            device.CreatedAt = DateTime.UtcNow;
            device.IsActive = false;
            device.Status = "OFF";

            _context.Devices.Add(device);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDevice), new { id = device.Id }, device);
        }

        // PUT: api/equipement/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDevice(int id, [FromBody] Device device)
        {
            var userId = GetUserId();
            var existingDevice = await _context.Devices
                .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

            if (existingDevice == null)
            {
                return NotFound(new { message = "Device non trouvé" });
            }

            existingDevice.Name = device.Name;
            existingDevice.Type = device.Type;
            existingDevice.Location = device.Location;
            existingDevice.Temperature = device.Temperature;

            await _context.SaveChangesAsync();

            return Ok(existingDevice);
        }

        // DELETE: api/equipement/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDevice(int id)
        {
            var userId = GetUserId();
            var device = await _context.Devices
                .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

            if (device == null)
            {
                return NotFound(new { message = "Device non trouvé" });
            }

            _context.Devices.Remove(device);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Device supprimé avec succès" });
        }

        // POST: api/equipement/5/toggle
        [HttpPost("{id}/toggle")]
        public async Task<IActionResult> ToggleDevice(int id)
        {
            var userId = GetUserId();
            var device = await _context.Devices
                .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

            if (device == null)
            {
                return NotFound(new { message = "Device non trouvé" });
            }

            device.IsActive = !device.IsActive;
            device.Status = device.IsActive ? "ON" : "OFF";

            await _context.SaveChangesAsync();

            return Ok(device);
        }
    }
}