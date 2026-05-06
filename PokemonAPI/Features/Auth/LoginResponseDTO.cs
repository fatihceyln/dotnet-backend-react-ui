namespace PokemonAPI.Features.Auth;

public sealed record LoginResponseDTO(
    string AccessToken,
    DateTime ExpiresAtUtc);
