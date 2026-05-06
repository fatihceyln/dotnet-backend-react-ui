namespace PokemonAPI.Features.Auth;

public sealed record LoginRequestDTO(
    string Username,
    string Password);
