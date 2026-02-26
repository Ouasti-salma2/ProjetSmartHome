using pfa__.net.Repositories;
using Microsoft.EntityFrameworkCore;
using pfa__.net.Data;
using pfa__.net.Helpers;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString,
        ServerVersion.AutoDetect(connectionString)));

// Repositories existants
builder.Services.AddScoped<IPieceRepository, PieceRepository>();
builder.Services.AddScoped<IEquipementRepository, EquipementRepository>();

// ← AJOUTE CES DEUX LIGNES
builder.Services.AddScoped<IConditionRepository, ConditionRepository>();
builder.Services.AddScoped<IRegleRepository, RegleRepository>();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseMiddleware<JwtMiddleware>();
app.UseCors("AllowAngular");
app.MapControllers();
app.Run();