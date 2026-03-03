using Blind_Blind_Backend.Config;
using Blind_Blind_Backend.Domain;
using Blind_Blind_Backend.Middlewares;
using Blind_Blind_Backend.Repositories.DataGames;
using Blind_Blind_Backend.Repositories.DataUsers;
using Blind_Blind_Backend.Services.DataUsers;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;

Env.Load(); // charge .env.development ou .env.production

var builder = WebApplication.CreateBuilder(args);

// Database config
var dbOptions = new DatabaseOptions
{
    Host = Environment.GetEnvironmentVariable("DB_HOST")!,
    Port = int.Parse(Environment.GetEnvironmentVariable("DB_PORT")!),
    Database = Environment.GetEnvironmentVariable("DB_NAME")!,
    User = Environment.GetEnvironmentVariable("DB_USER")!,
    Password = Environment.GetEnvironmentVariable("DB_PASSWORD")!
};

builder.Services.AddSingleton(dbOptions);

builder.Services.AddDbContext<BlindBlindContext>(options =>
    options.UseNpgsql(dbOptions.GetConnectionString())
);

// API + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5004",
                    "https://localhost:7200"
                )
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

// Services
builder.Services.Scan(scan => scan
    .FromAssemblyOf<IUserService>()
    .AddClasses(classes => classes.Where(c => c.Name.EndsWith("Service")))
    .AsImplementedInterfaces()
    .WithScopedLifetime());

// Repositories
builder.Services.Scan(scan => scan
    .FromAssemblyOf<IUserRepository>()
    .AddClasses(classes => classes.Where(c => c.Name.EndsWith("Repository")))
    .AsImplementedInterfaces()
    .WithScopedLifetime());

builder.Services.Scan(scan => scan
    .FromAssemblyOf<IGamesRepository>()
    .AddClasses(classes => classes.Where(c => c.Name.EndsWith("Repository")))
    .AsImplementedInterfaces()
    .WithScopedLifetime());


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    var url = "http://localhost:5004/swagger";
    System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
    {
        FileName = url,
        UseShellExecute = true
    });
}
app.UseCors("AllowLocalhost");
app.UseHttpsRedirection();
app.UseHttpLoggingMiddleware();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
