using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokemonAPI.Migrations
{
    /// <inheritdoc />
    public partial class SeedRegularUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "id", "password_hash", "role", "username" },
                values: new object[] { 2, "AQAAAAIAAYagAAAAEEU3SVYNZ/7w5haizgu/eWLo7WAcf+1o8TtphzyqrBVW6fP5Kc9lvhA42tkLZPzrmw==", "User", "user" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: 2);
        }
    }
}
