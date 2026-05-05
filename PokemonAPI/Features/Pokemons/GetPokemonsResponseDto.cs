namespace PokemonAPI.Features.Pokemons;

public sealed record GetPokemonsResponseDTO(IReadOnlyList<PokemonListItemResponseDTO> Data);

public sealed record PokemonListItemResponseDTO(
    int Id,
    string Name);
