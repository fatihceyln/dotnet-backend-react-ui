using Microsoft.EntityFrameworkCore;
using PokemonAPI.Infrastructure.Persistence;

namespace PokemonAPI.Features.Pokemons;

public sealed class PokemonService(PokemonDbContext dbContext)
{
    public async Task<GetPokemonsResponseDto> GetPokemonsAsync(
        string? search,
        CancellationToken cancellationToken = default)
    {
        if (search is not null && string.IsNullOrWhiteSpace(search))
        {
            return new GetPokemonsResponseDto([]);
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
            .Select(pokemon => new PokemonListItemResponseDto(
                pokemon.Id,
                pokemon.Name))
            .ToListAsync(cancellationToken);

        return new GetPokemonsResponseDto(pokemons);
    }

    public async Task<GetPokemonByIdResponseDto?> GetPokemonByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        var pokemon = await dbContext.Pokemons
            .AsNoTracking()
            .Where(pokemon => pokemon.Id == id)
            .Select(pokemon => new PokemonDetailResponseDto(
                pokemon.Id,
                pokemon.Name,
                pokemon.Type,
                pokemon.Age))
            .SingleOrDefaultAsync(cancellationToken);

        return pokemon is null
            ? null
            : new GetPokemonByIdResponseDto(pokemon);
    }
}
