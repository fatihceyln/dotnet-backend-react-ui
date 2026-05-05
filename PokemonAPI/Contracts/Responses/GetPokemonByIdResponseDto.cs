namespace PokemonAPI.Contracts.Responses;

public sealed record GetPokemonByIdResponseDto(PokemonDetailResponseDto Data);

public sealed record PokemonDetailResponseDto(
    int Id,
    string Name,
    string Type,
    int Age);
