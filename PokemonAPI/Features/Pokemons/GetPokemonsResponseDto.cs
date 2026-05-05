namespace PokemonAPI.Features.Pokemons;

public sealed record GetPokemonsResponseDto(IReadOnlyList<PokemonListItemResponseDto> Data);

public sealed record PokemonListItemResponseDto(
    int Id,
    string Name);
