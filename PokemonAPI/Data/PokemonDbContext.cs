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

            entity.Property(pokemon => pokemon.Type)
                .HasColumnName("type")
                .IsRequired();

            entity.Property(pokemon => pokemon.Age)
                .HasColumnName("age");

            entity.HasData(
                new Pokemon { Id = 1, Name = "scyther", Type = "hava", Age = 5 },
                new Pokemon { Id = 2, Name = "lapras", Type = "su", Age = 9 },
                new Pokemon { Id = 3, Name = "arcanine", Type = "ateş", Age = 7 },
                new Pokemon { Id = 4, Name = "alakazam", Type = "hava", Age = 11 },
                new Pokemon { Id = 5, Name = "gyarados", Type = "su", Age = 8 },
                new Pokemon { Id = 6, Name = "jolteon", Type = "hava", Age = 4 },
                new Pokemon { Id = 7, Name = "clefairy", Type = "hava", Age = 3 },
                new Pokemon { Id = 8, Name = "onix", Type = "hava", Age = 10 },
                new Pokemon { Id = 9, Name = "starmie", Type = "su", Age = 6 },
                new Pokemon { Id = 10, Name = "ditto", Type = "hava", Age = 2 });
        });
    }
}
