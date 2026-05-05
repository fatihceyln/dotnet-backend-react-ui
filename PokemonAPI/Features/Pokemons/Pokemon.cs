namespace PokemonAPI.Features.Pokemons;

public sealed class Pokemon
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Type { get; set; } = string.Empty;

    public int Age { get; set; }
}
