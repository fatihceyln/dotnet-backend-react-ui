using Microsoft.EntityFrameworkCore;
using PokemonAPI.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");

builder.Services.AddDbContext<PokemonDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/pokemons", async (PokemonDbContext dbContext) =>
{
    var pokemons = await dbContext.Pokemons
        .AsNoTracking()
        .OrderBy(pokemon => pokemon.Id)
        .Select(pokemon => new
        {
            id = pokemon.Id,
            name = pokemon.Name
        })
        .ToListAsync();

    return Results.Ok(new { data = pokemons });
});

app.Run();
