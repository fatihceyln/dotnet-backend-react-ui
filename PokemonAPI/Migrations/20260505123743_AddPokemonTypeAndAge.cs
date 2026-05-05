using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokemonAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddPokemonTypeAndAge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "age",
                table: "pokemons",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "type",
                table: "pokemons",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "age", "type" },
                values: new object[] { 5, "hava" });

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "age", "type" },
                values: new object[] { 9, "su" });

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "age", "type" },
                values: new object[] { 7, "ateş" });

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "age", "type" },
                values: new object[] { 11, "hava" });

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "age", "type" },
                values: new object[] { 8, "su" });

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 6,
                columns: new[] { "age", "type" },
                values: new object[] { 4, "hava" });

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 7,
                columns: new[] { "age", "type" },
                values: new object[] { 3, "hava" });

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 8,
                columns: new[] { "age", "type" },
                values: new object[] { 10, "hava" });

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 9,
                columns: new[] { "age", "type" },
                values: new object[] { 6, "su" });

            migrationBuilder.UpdateData(
                table: "pokemons",
                keyColumn: "id",
                keyValue: 10,
                columns: new[] { "age", "type" },
                values: new object[] { 2, "hava" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "age",
                table: "pokemons");

            migrationBuilder.DropColumn(
                name: "type",
                table: "pokemons");
        }
    }
}
