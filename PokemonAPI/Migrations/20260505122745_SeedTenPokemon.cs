using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PokemonAPI.Migrations
{
    /// <inheritdoc />
    public partial class SeedTenPokemon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 1,
                column: "name",
                value: "scyther");

            migrationBuilder.InsertData(
                table: "pokemons",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 2, "lapras" },
                    { 3, "arcanine" },
                    { 4, "alakazam" },
                    { 5, "gyarados" },
                    { 6, "jolteon" },
                    { 7, "clefairy" },
                    { 8, "onix" },
                    { 9, "starmie" },
                    { 10, "ditto" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 10);

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 1,
                column: "name",
                value: "charmander");
        }
    }
}
