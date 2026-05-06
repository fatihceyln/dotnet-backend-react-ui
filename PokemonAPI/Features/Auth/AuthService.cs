using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PokemonAPI.Infrastructure.Persistence;

namespace PokemonAPI.Features.Auth;

public sealed class AuthService(
    PokemonDbContext dbContext,
    IPasswordHasher<User> passwordHasher)
{
    public async Task<User?> AuthenticateAsync(
        LoginRequestDTO request,
        CancellationToken cancellationToken = default)
    {
        var username = request.Username.Trim();

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return null;
        }

        var user = await dbContext.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(existingUser => existingUser.Username == username, cancellationToken);

        if (user is null)
        {
            return null;
        }

        var verificationResult = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

        return verificationResult == PasswordVerificationResult.Failed
            ? null
            : user;
    }
}
