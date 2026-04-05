using Blind_Blind_Backend.Config;
using Blind_Blind_Backend.Domain;
using Blind_Blind_Backend.DTOs.General;
using Blind_Blind_Backend.Middlewares;
using Blind_Blind_Backend.Repositories.DataGames;
using Blind_Blind_Backend.Repositories.DataUsers;
using Blind_Blind_Backend.Services.DataGames;
using Blind_Blind_Backend.Services.DataUsers;
using Blind_Blind_Backend.Services.General;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

Env.Load(); // charge .env.development ou .env.production

var builder = WebApplication.CreateBuilder(args);

#region Database config
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
#endregion

#region API + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Entrez votre token JWT comme ceci : Bearer {votre_token}"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:5004",
                "https://localhost:7200"
            )
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});
#endregion

#region AutoMapper
// Services
builder.Services.Scan(scan => scan
    .FromAssemblyOf<IUserService>()
    .AddClasses(classes => classes.Where(c => c.Name.EndsWith("Service")))
    .AsImplementedInterfaces()
    .WithScopedLifetime());

builder.Services.Scan(scan => scan
    .FromAssemblyOf<IGamesService>()
    .AddClasses(classes => classes.Where(c => c.Name.EndsWith("Service")))
    .AsImplementedInterfaces()
    .WithScopedLifetime());

builder.Services.Scan(scan => scan
    .FromAssemblyOf<IAuthService>()
    .AddClasses(classes => classes.Where(c => c.Name.EndsWith("Service")))
    .AsImplementedInterfaces()
    .WithScopedLifetime());

builder.Services.Scan(scan => scan
    .FromAssemblyOf<IGeneralService>()
    .AddClasses(classes => classes.Where(c => c.Name.EndsWith("Service")))
    .AsImplementedInterfaces()
    .WithScopedLifetime());

builder.Services.Scan(scan => scan
    .FromAssemblyOf<IMusicDataService>()
    .AddClasses(classes => classes.Where(c => c.Name.EndsWith("Service")))
    .AsImplementedInterfaces()
    .WithScopedLifetime());

builder.Services.Scan(scan => scan
    .FromAssemblyOf<IMusicSuggestionsService>()
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

builder.Services.Scan(scan => scan
    .FromAssemblyOf<IAuthRepository>()
    .AddClasses(classes => classes.Where(c => c.Name.EndsWith("Repository")))
    .AsImplementedInterfaces()
    .WithScopedLifetime());

builder.Services.Scan(scan => scan
    .FromAssemblyOf<IMusicDataRepository>()
    .AddClasses(classes => classes.Where(c => c.Name.EndsWith("Repository")))
    .AsImplementedInterfaces()
    .WithScopedLifetime());

builder.Services.Scan(scan => scan
    .FromAssemblyOf<IMusicSuggestionsRepository>()
    .AddClasses(classes => classes.Where(c => c.Name.EndsWith("Repository")))
    .AsImplementedInterfaces()
    .WithScopedLifetime());
#endregion

#region Auth JWT
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");

builder.Services.Configure<JwtOptionsDTO>(options =>
{
    options.Key = jwtKey!;
    options.Issuer = jwtIssuer!;
    options.Audience = jwtAudience!;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey!)
        )
    };
});
#endregion

#region Authorization Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("OwnerOnly", policy =>
    policy.RequireAssertion(context =>
    {
        var userId = context.User.FindFirst("Id_User")?.Value;

        var routeId = context.Resource switch
        {
            HttpContext httpContext => httpContext.Request.RouteValues["id"]?.ToString(),

            Microsoft.AspNetCore.Mvc.Filters.AuthorizationFilterContext mvcContext
                => mvcContext.RouteData.Values["id"]?.ToString(),

            _ => null
        };

        return userId != null && userId == routeId;
    }));

    options.AddPolicy("AdminOnly", policy =>
        policy.RequireClaim("Role", "Admin"));

    options.AddPolicy("OwnerOrAdmin", policy =>
    policy.RequireAssertion(context =>
    {
        var userId = context.User.FindFirst("Id_User")?.Value;
        var role = context.User.FindFirst("Role")?.Value;

        var routeId = context.Resource switch
        {
            HttpContext httpContext => httpContext.Request.RouteValues["id"]?.ToString(),
            _ => null
        };

        return role == "Admin" || userId == routeId;
    }));
});
#endregion

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

//app.UseHttpsRedirection();

app.UseHttpLoggingMiddleware();
//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
