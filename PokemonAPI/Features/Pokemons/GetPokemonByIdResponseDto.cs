namespace PokemonAPI.Features.Pokemons;

public sealed record GetPokemonByIdResponseDTO(PokemonDetailResponseDTO Data);

public sealed record PokemonDetailResponseDTO(
    int Id,
    string Name,
    string Type,
    int Age);
