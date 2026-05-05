using Microsoft.EntityFrameworkCore;
using PokemonAPI.Contracts.Responses;
using PokemonAPI.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");

builder.Services.AddDbContext<PokemonDbContext>(options =>
    options.UseNpgsql(connectionString));

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

app.MapGet("/pokemons", async (PokemonDbContext dbContext) =>
{
    var pokemons = await dbContext.Pokemons
        .AsNoTracking()
        .OrderBy(pokemon => pokemon.Id)
        .Select(pokemon => new PokemonListItemResponseDto(
            pokemon.Id,
            pokemon.Name))
        .ToListAsync();

    return Results.Ok(new GetPokemonsResponseDto(pokemons));
});

app.MapGet("/pokemons/{id:int}", async (int id, PokemonDbContext dbContext) =>
{
    var pokemon = await dbContext.Pokemons
        .AsNoTracking()
        .Where(pokemon => pokemon.Id == id)
        .Select(pokemon => new PokemonDetailResponseDto(
            pokemon.Id,
            pokemon.Name,
            pokemon.Type,
            pokemon.Age))
        .SingleOrDefaultAsync();

    return pokemon is null
        ? Results.NotFound()
        : Results.Ok(new GetPokemonByIdResponseDto(pokemon));
});

app.Run();
