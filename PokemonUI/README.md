# PokemonUI

Bu klasor frontend UI projesini icerir. Uygulama `React` ve `Vite` kullanir.

## Gereksinimler

- Node.js 20+
- npm
- Ayakta olan backend API

## Kullandigi portlar

- UI dev server: `http://localhost:5173`
- Proxy ile baglandigi API: `http://localhost:5102`

UI, `/pokemons` isteklerini Vite proxy uzerinden API'ye iletir. Bu yuzden backend ayakta degilse ekran calismaz.

## Uygulamayi ayaga kaldirma

1. Backend'i ayaga kaldir:

   API projesi `http://localhost:5102` uzerinde calisiyor olmali.

2. Bagimliliklari yukle:

```bash
npm install
```

3. UI'yi calistir:

```bash
npm run dev
```

4. Tarayicida ac:

- `http://localhost:5173`

## Build ve kalite komutlari

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Local preview:

```bash
npm run preview
```

## API baglantisi

Proxy ayari [`vite.config.js`](/Users/fatih/Documents/dotnet-backend/PokemonUI/vite.config.js) icinde tanimli:

```js
target: 'http://localhost:5102'
```

Backend farkli portta calisacaksa bu dosyayi guncellemen gerekir.

## Sorun giderme

- `fetch` hatasi aliyorsan, sorun buyuk ihtimalle UI degil backend'dir. Once API'yi kontrol et.
- `5173` portu doluysa Vite farkli port acabilir. Terminal ciktisini kontrol et.
- Proxy calismiyorsa `vite.config.js` icindeki target ile API'nin gercek portu ayni degildir.
