namespace PokemonAPI.Features.Pokemons;

public sealed record CreatePokemonRequestDTO(
    string Name,
    string Type,
    int Age);
