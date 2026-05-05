var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/pokemons", () =>
{
    var response = new
    {
        data = new[]
        {
            new
            {
                id = 1,
                name = "charmender"
            }
        }
    };

    return Results.Ok(response);
});

app.Run();
