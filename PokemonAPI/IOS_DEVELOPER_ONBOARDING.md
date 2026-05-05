# iOS Developer Icin Backend Onboarding

Bu repo iki parca iceriyor:

- `PokemonAPI`: .NET backend
- `PokemonUI`: frontend

Bu dokuman sadece backend'i anlatir.

## Gercek Durum

Backend su an kucuk bir `.NET 10` Minimal API uygulamasi:

- Controller yok
- Clean Architecture yok
- CQRS yok
- Repository katmani yok
- Auth yok
- Write endpoint yok

Ama su ayrim var:

- HTTP route'lar `Program.cs` icinde
- Pokemon use-case'leri `PokemonService` icinde
- EF Core/PostgreSQL persistence'i `PokemonDbContext` icinde
- API response contract'lari DTO'larla tanimli

Bu boyuttaki proje icin bu yapi yeterli. Daha fazla soyutlama su an gereksiz.

## Klasor Yapisi

- `Program.cs`
  Uygulamanin giris noktasi. DI, Swagger ve endpoint mapping burada.
- `Features/Pokemons/Pokemon.cs`
  `Pokemon` entity'si. Veritabani modelini temsil eder.
- `Features/Pokemons/PokemonService.cs`
  Listeleme ve detay getirme use-case'leri burada.
- `Features/Pokemons/GetPokemonsResponseDto.cs`
  Liste endpoint'inin response contract'i.
- `Features/Pokemons/GetPokemonByIdResponseDto.cs`
  Detay endpoint'inin response contract'i.
- `Infrastructure/Persistence/PokemonDbContext.cs`
  EF Core context'i, tablo mapping'i ve seed data burada.
- `Migrations`
  Schema gecmisi.
- `appsettings.Development.json`
  Local PostgreSQL connection string'i.
- `Properties/launchSettings.json`
  Local calisma profilleri ve portlar.

## iOS Tarafindan Neye Denk Geliyor

- `Program.cs` ~= app startup + router
- `MapGet(...)` ~= URL route tanimi
- `PokemonService` ~= application/use-case katmani
- `PokemonDbContext` ~= persistence adapter
- `Migration` ~= schema versioning
- DTO'lar ~= app'in decode edecegi API contract'i

## Mevcut Endpoint'ler

Su an sadece 2 endpoint var:

### `GET /pokemons`

Tum Pokemon'lari listeler.

Opsiyonel query param:

- `search`

Ornek:

```text
GET /pokemons
GET /pokemons?search=ar
```

Response:

```json
{
  "data": [
    {
      "id": 1,
      "name": "scyther"
    }
  ]
}
```

Notlar:

- `search` verilmezse tum liste doner.
- `search` verilirse `name` alaninda case-insensitive arama yapilir.
- Arama PostgreSQL `ILIKE` ile yapiliyor.
- `search` bosluk karakterlerinden olusuyorsa backend bos liste doner.

### `GET /pokemons/{id}`

Tek bir Pokemon'un detayini doner.

Ornek:

```text
GET /pokemons/3
```

Response:

```json
{
  "data": {
    "id": 3,
    "name": "arcanine",
    "type": "ateş",
    "age": 7
  }
}
```

Notlar:

- Kayit varsa `200 OK`
- Kayit yoksa `404 Not Found`

## Request Akisi

Bir request geldiginde olan sey:

1. `Program.cs` route'u esler.
2. Endpoint, `PokemonService`'i DI ile alir.
3. `PokemonService`, `PokemonDbContext` uzerinden EF Core sorgusu calistirir.
4. Entity dogrudan disariya verilmez, DTO'ya projection yapilir.
5. Sonuc `200 OK` veya `404 Not Found` olarak doner.

## Veritabani

Stack:

- PostgreSQL 17
- EF Core 10
- `Npgsql.EntityFrameworkCore.PostgreSQL`

Docker compose ayari repo root'ta:

- container: `pokemonapi-postgres`
- host port: `5433`
- db name: `pokemonapi`
- username: `postgres`
- password: `postgres`

Development connection string:

```text
Host=localhost;Port=5433;Database=pokemonapi;Username=postgres;Password=postgres
```

Bu ayar local icin kabul edilebilir. Production icin dogru degil. Secret'lar config dosyasinda tutulmaz.

## Seed Data

Uygulama seed data ile geliyor. `PokemonDbContext` icinde 10 kayit var.

Ornek kayitlar:

- `scyther`
- `lapras`
- `arcanine`
- `alakazam`
- `gyarados`

Onemli nokta:

- Seed data `HasData(...)` ile tanimli.
- Seed'i degistirmek migration gerektirir.
- Sadece `DbContext` veya entity degistirmek yetmez.

## Migration Akisi

Mevcut migration sirasi:

1. `InitialCreate`
2. `SeedTenPokemon`
3. `AddPokemonTypeAndAge`

Kurallar:

- Eski migration'lari keyfine gore editleme.
- Model degisirse yeni migration uret.
- Migration'i review et.
- Sonra veritabanina uygula.

Komutlar:

```bash
dotnet ef migrations add MigrationAdi
dotnet ef database update
```

## Uygulamayi Local Calistirma

1. Root klasorde PostgreSQL'i baslat:

```bash
docker compose up -d
```

2. API klasorunde migration'lari uygula:

```bash
dotnet ef database update
```

3. API'yi calistir:

```bash
dotnet run
```

## Portlar

Launch profile bilgisi:

- HTTP: `http://localhost:5102`
- HTTPS: `https://localhost:7039`

Swagger sadece `Development` ortaminda acik:

- `http://localhost:5102/swagger`
- `https://localhost:7039/swagger`

`app.UseHttpsRedirection()` aktif. Bu yuzden istemci tarafinda HTTP/HTTPS davranisini bilmeden debug etmeye calisma.

## JSON Sozlesmesi

C# tarafinda property isimleri `PascalCase`, ama API JSON'u web default'u nedeniyle `camelCase` doner:

- `Data` -> `data`
- `Id` -> `id`
- `Name` -> `name`
- `Type` -> `type`
- `Age` -> `age`

iOS tarafinda decode ederken bunu baz al.

## Dosya Bazinda Dikkat Edilecekler

### `Program.cs`

Burasi hala ince bir API composition root:

- connection string okur
- `PokemonDbContext` kaydeder
- `PokemonService` kaydeder
- Swagger'i acar
- endpoint'leri map eder

Su an kabul edilebilir. Ama endpoint sayisi buyurse bu dosya sisecak.

### `PokemonService.cs`

Burasi su an application/use-case katmani gibi davraniyor.

Ama bir gercegi net soylemek lazim:

- Service dogrudan `DbContext` kullaniyor.
- Yani data access tamamen izole edilmis degil.
- Bu boyut icin sorun degil.
- Daha buyuk sistemde sorgu karmasiklasirsa application ve infrastructure ayrimi daha net kurulmalı.

### `PokemonDbContext.cs`

Burasi persistence gerceginin merkezi:

- tablo adi: `pokemons`
- kolonlar: `id`, `name`, `type`, `age`
- seed data burada

Business logic burada olmamali. Su an da degil.

## Su Anda Olmayan Seyler

Bunlari var sanma:

- authentication / authorization
- create/update/delete endpoint'leri
- pagination
- validation pipeline
- test projesi
- repository pattern
- controller katmani

Yani bu backend su an basit bir read-only demo API degil; local development icin duzenli tutulmus kucuk bir servis. Ama production-grade olmak icin hala eksikleri var.

## iOS Tarafi Icin Pratik Ozet

Senin bilmen gereken minimum sey:

- Base URL localde `http://localhost:5102` veya `https://localhost:7039`
- Liste endpoint'i `GET /pokemons`
- Arama endpoint'i ayni route: `GET /pokemons?search=...`
- Detay endpoint'i `GET /pokemons/{id}`
- JSON `camelCase`
- Detay endpoint'i bulunamazsa `404` doner

Backend'te yeni alan, yeni endpoint veya response degisikligi yaparsan ilk bakman gereken yerler:

- route icin `Program.cs`
- use-case icin `PokemonService.cs`
- contract icin DTO dosyalari
- schema icin `Pokemon.cs` + `PokemonDbContext.cs` + `Migrations`
