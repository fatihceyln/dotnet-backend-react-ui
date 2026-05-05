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

            entity.HasData(
                new Pokemon { Id = 1, Name = "scyther" },
                new Pokemon { Id = 2, Name = "lapras" },
                new Pokemon { Id = 3, Name = "arcanine" },
                new Pokemon { Id = 4, Name = "alakazam" },
                new Pokemon { Id = 5, Name = "gyarados" },
                new Pokemon { Id = 6, Name = "jolteon" },
                new Pokemon { Id = 7, Name = "clefairy" },
                new Pokemon { Id = 8, Name = "onix" },
                new Pokemon { Id = 9, Name = "starmie" },
                new Pokemon { Id = 10, Name = "ditto" });
        });
    }
}
