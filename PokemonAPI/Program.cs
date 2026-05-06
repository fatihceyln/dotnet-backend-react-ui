using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PokemonAPI.Features.Auth;
using PokemonAPI.Features.Pokemons;
using PokemonAPI.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT key was not found.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("JWT issuer was not found.");
var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("JWT audience was not found.");
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddDbContext<PokemonDbContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<PokemonService>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
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
            IssuerSigningKey = signingKey,
            ClockSkew = TimeSpan.Zero
        };
    });
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (builder.Environment.IsDevelopment())
{
    builder.Services.ConfigureHttpJsonOptions(options =>
        options.SerializerOptions.WriteIndented = true);
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/auth/login", async (
    LoginRequestDTO request,
    AuthService authService,
    CancellationToken cancellationToken) =>
{
    var user = await authService.AuthenticateAsync(request, cancellationToken);

    if (user is null)
    {
        return Results.Unauthorized();
    }

    var expiresAtUtc = DateTime.UtcNow.AddHours(1);
    var claims = new List<Claim>
    {
        new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new(ClaimTypes.Name, user.Username),
        new(ClaimTypes.Role, user.Role)
    };

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(claims),
        Expires = expiresAtUtc,
        Issuer = jwtIssuer,
        Audience = jwtAudience,
        SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    var securityToken = tokenHandler.CreateToken(tokenDescriptor);
    var accessToken = tokenHandler.WriteToken(securityToken);

    return Results.Ok(new LoginResponseDTO(accessToken, expiresAtUtc));
});

app.MapGet("/pokemons", async (
    string? search,
    PokemonService pokemonService,
    CancellationToken cancellationToken) =>
{
    var response = await pokemonService.GetPokemonsAsync(search, cancellationToken);
    return Results.Ok(response);
});

app.MapGet("/pokemons/{id:int}", async (
    int id,
    PokemonService pokemonService,
    CancellationToken cancellationToken) =>
{
    var response = await pokemonService.GetPokemonByIdAsync(id, cancellationToken);
    return response is null
        ? Results.NotFound()
        : Results.Ok(response);
});

app.MapPost("/pokemons", async (
    CreatePokemonRequestDTO request,
    PokemonService pokemonService,
    CancellationToken cancellationToken) =>
{
    var createdPokemon = await pokemonService.CreatePokemonAsync(request, cancellationToken);
    return Results.Created($"/pokemons/{createdPokemon.Id}", createdPokemon);
})
.RequireAuthorization("AdminOnly");

app.Run();
