Simple full-stack Pokemon sample application.

This repository contains:

- `PokemonAPI`: ASP.NET Core Minimal API with Entity Framework Core and PostgreSQL
- `PokemonUI`: React + Vite frontend that consumes the API
- `docker-compose.yml`: local PostgreSQL setup

## Stack

- .NET 10
- ASP.NET Core Minimal API
- Entity Framework Core
- PostgreSQL 17
- React 19
- Vite

## Project Structure

```text
.
├── PokemonAPI/
├── PokemonUI/
└── docker-compose.yml
```

## What It Does

- Lists seeded Pokemon records
- Filters Pokemon by name with `search`
- Returns Pokemon detail by id
- Provides a small frontend for browsing the data

## Requirements

- .NET 10 SDK
- Node.js 20+
- Docker

## Local Setup

### 1. Start PostgreSQL

```bash
docker compose up -d
```

PostgreSQL runs on:

- Host: `localhost`
- Port: `5433`
- Database: `pokemonapi`
- Username: `postgres`
- Password: `postgres`

### 2. Run the API

```bash
cd PokemonAPI
dotnet ef database update
dotnet run
```

API default development URL:

- `http://localhost:5102`

Swagger is available in development:

- `http://localhost:5102/swagger`

### 3. Run the UI

```bash
cd PokemonUI
npm install
npm run dev
```

UI default development URL:

- `http://localhost:5173`

The Vite dev server proxies `/pokemons` requests to `http://localhost:5102`.

## API Endpoints

### `GET /pokemons`

Returns all Pokemon.

Example:

```bash
curl http://localhost:5102/pokemons
```

### `GET /pokemons?search=scy`

Returns Pokemon whose names match the search term.

Example:

```bash
curl "http://localhost:5102/pokemons?search=scy"
```

### `GET /pokemons/{id}`

Returns a single Pokemon by id.

Example:

```bash
curl http://localhost:5102/pokemons/1
```

## Seed Data

The database is seeded through EF Core with 10 Pokemon records.

## Useful Commands

### Backend

```bash
cd PokemonAPI
dotnet build
dotnet ef migrations add MigrationName
```

### Frontend

```bash
cd PokemonUI
npm run build
npm run lint
npm run preview
```

## Notes

- The development connection string lives in `PokemonAPI/appsettings.Development.json`.
- If the UI fails to load data, the backend is usually not running on `http://localhost:5102`.
