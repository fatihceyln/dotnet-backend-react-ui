using Microsoft.EntityFrameworkCore;
using PokemonAPI.Models;

namespace PokemonAPI.Data;

public sealed class PokemonDbContext(DbContextOptions<PokemonDbContext> options) : DbContext(options)
{
    public DbSet<Pokemon> Pokemons => Set<Pokemon>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pokemon>(entity =>
        {
            entity.ToTable("pokemons");

            entity.HasKey(pokemon => pokemon.Id);

            entity.Property(pokemon => pokemon.Id)
                .HasColumnName("id");

            entity.Property(pokemon => pokemon.Name)
                .HasColumnName("name")
                .IsRequired();

            entity.HasData(new Pokemon
            {
                Id = 1,
                Name = "charmander"
            });
        });
    }
}
