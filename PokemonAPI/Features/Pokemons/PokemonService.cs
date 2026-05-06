using Microsoft.EntityFrameworkCore;
using PokemonAPI.Infrastructure.Persistence;

namespace PokemonAPI.Features.Pokemons;

public sealed class PokemonService(PokemonDbContext dbContext)
{
    public async Task<GetPokemonsResponseDTO> GetPokemonsAsync(
        string? search,
        CancellationToken cancellationToken = default)
    {
        if (search is not null && string.IsNullOrWhiteSpace(search))
        {
            return new GetPokemonsResponseDTO([]);
        }

        var query = dbContext.Pokemons
            .AsNoTracking()
            .AsQueryable();

        if (search is not null)
        {
            query = query.Where(pokemon => EF.Functions.ILike(pokemon.Name, $"%{search}%"));
        }

        var pokemons = await query
            .OrderBy(pokemon => pokemon.Id)
            .Select(pokemon => new PokemonListItemResponseDTO(
                pokemon.Id,
                pokemon.Name))
            .ToListAsync(cancellationToken);

        return new GetPokemonsResponseDTO(pokemons);
    }

    public async Task<GetPokemonByIdResponseDTO?> GetPokemonByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        var pokemon = await dbContext.Pokemons
            .AsNoTracking()
            .Where(pokemon => pokemon.Id == id)
            .Select(pokemon => new PokemonDetailResponseDTO(
                pokemon.Id,
                pokemon.Name,
                pokemon.Type,
                pokemon.Age))
            .SingleOrDefaultAsync(cancellationToken);

        return pokemon is null
            ? null
            : new GetPokemonByIdResponseDTO(pokemon);
    }

    public async Task<PokemonDetailResponseDTO> CreatePokemonAsync(
        CreatePokemonRequestDTO request,
        CancellationToken cancellationToken = default)
    {
        var pokemon = new Pokemon
        {
            Name = request.Name.Trim(),
            Type = request.Type.Trim(),
            Age = request.Age
        };

        dbContext.Pokemons.Add(pokemon);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new PokemonDetailResponseDTO(
            pokemon.Id,
            pokemon.Name,
            pokemon.Type,
            pokemon.Age);
    }
}
