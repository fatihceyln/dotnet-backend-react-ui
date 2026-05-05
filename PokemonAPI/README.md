# PokemonAPI

Bu klasor backend API projesini icerir. Uygulama `.NET 10`, `EF Core` ve `PostgreSQL` kullanir.

## Gereksinimler

- .NET SDK 10
- Docker
- PostgreSQL istemcisi opsiyonel

## Kullandigi portlar

- API: `http://localhost:5102`
- PostgreSQL container: `localhost:5433`

## Veritabani ayari

Development ortaminda connection string [`appsettings.Development.json`](/Users/fatih/Documents/dotnet-backend/PokemonAPI/appsettings.Development.json) icinde tanimli:

```json
"Host=localhost;Port=5433;Database=pokemonapi;Username=postgres;Password=postgres"
```

Bu haliyle local development icin calisir. Production icin bu yaklasim dogru degil. Secret'lari config provider veya environment variable ile yonet.

## Uygulamayi ayaga kaldirma

1. PostgreSQL'i baslat:

```bash
docker compose up -d
```

2. Migration'lari veritabanina uygula:

```bash
dotnet ef database update
```

3. API'yi calistir:

```bash
dotnet run
```

API development profilinde `http://localhost:5102` adresinden acilir.

## Swagger

Development ortaminda Swagger aktiftir:

- `http://localhost:5102/swagger`

## Mevcut endpoint'ler

- `GET /pokemons`
- `GET /pokemons?search=pika`
- `GET /pokemons/{id}`

## Sık kullanilan komutlar

Migration olusturma:

```bash
dotnet ef migrations add MigrationAdi
```

Projeyi derleme:

```bash
dotnet build
```

## Sorun giderme

- `Failed to connect` hatasi aliyorsan, PostgreSQL container ayakta degildir veya `5433` portu doludur.
- `dotnet ef` komutu yoksa EF Core CLI kurulu degildir:

```bash
dotnet tool install --global dotnet-ef
```

- UI veri cekemiyorsa once API'nin `http://localhost:5102` uzerinde ayakta oldugunu dogrula.
