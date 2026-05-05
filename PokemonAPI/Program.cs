using Microsoft.EntityFrameworkCore;
using PokemonAPI.Features.Pokemons;
using PokemonAPI.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");

builder.Services.AddDbContext<PokemonDbContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddScoped<PokemonService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (builder.Environment.IsDevelopment())
{
    builder.Services.ConfigureHttpJsonOptions(options =>
    {
        options.SerializerOptions.WriteIndented = true;
    });
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/pokemons", async (PokemonService pokemonService, CancellationToken cancellationToken) =>
{
    var response = await pokemonService.GetPokemonsAsync(cancellationToken);
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

app.Run();
