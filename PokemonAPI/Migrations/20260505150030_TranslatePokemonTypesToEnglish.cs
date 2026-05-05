using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokemonAPI.Migrations
{
    /// <inheritdoc />
    public partial class TranslatePokemonTypesToEnglish : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 1,
                column: "type",
                value: "air");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 2,
                column: "type",
                value: "water");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 3,
                column: "type",
                value: "fire");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 4,
                column: "type",
                value: "air");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 5,
                column: "type",
                value: "water");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 6,
                column: "type",
                value: "air");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 7,
                column: "type",
                value: "air");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 8,
                column: "type",
                value: "air");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 9,
                column: "type",
                value: "water");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 10,
                column: "type",
                value: "air");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 1,
                column: "type",
                value: "hava");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 2,
                column: "type",
                value: "su");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 3,
                column: "type",
                value: "ateş");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 4,
                column: "type",
                value: "hava");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 5,
                column: "type",
                value: "su");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 6,
                column: "type",
                value: "hava");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 7,
                column: "type",
                value: "hava");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 8,
                column: "type",
                value: "hava");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 9,
                column: "type",
                value: "su");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 10,
                column: "type",
                value: "hava");
        }
    }
}
