using Microsoft.EntityFrameworkCore;
using PokemonAPI.Contracts.Responses;
using PokemonAPI.Data;

namespace PokemonAPI.Application.Services;

public sealed class PokemonService(PokemonDbContext dbContext)
{
    public async Task<GetPokemonsResponseDto> GetPokemonsAsync(CancellationToken cancellationToken = default)
    {
        var pokemons = await dbContext.Pokemons
            .AsNoTracking()
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
