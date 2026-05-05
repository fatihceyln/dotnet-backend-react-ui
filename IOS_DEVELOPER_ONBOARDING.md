# .NET Bilmeyen iOS Developer Icin Proje Ozeti

Bu repo su an tek bir kucuk `.NET` Web API projesi. Tam katmanli "clean architecture" yok, ama artik oncekinden daha duzenli bir ayrim var:

- `Program.cs`: uygulamanin giris noktasi ve route mapping
- `Features/Pokemons`: Pokemon feature'ina ait model, response DTO ve service
- `Infrastructure/Persistence`: EF Core `DbContext` ve veritabani persistence katmani
- `Migrations`: schema gecmisi

En kisa haliyle:

- route'lar `Program.cs` icinde
- business/query orchestration `PokemonService` icinde
- EF Core/PostgreSQL erisimi `PokemonDbContext` icinde
- API'nin dondugu JSON shape'i DTO'lar ile tanimli

Bu proje bir iOS developer icin su sekilde dusunulebilir:

- `Program.cs` ~= app startup + router
- `MapGet(...)` ~= backend route tanimi
- `PokemonService` ~= use-case/service katmani
- `PokemonDbContext` ~= persistence adapter / Core Data stack benzeri veri erisim noktasi
- `Migration` ~= schema versioning + upgrade script
- `appsettings.*.json` ~= environment bazli config

## Genel Mimari

Proje dosya duzeni:

- `AGENTS.md`
  Repo kurallari. Mimariyi gereksiz soyutlamadan uzak, basit ve production-ready tutmayi istiyor.
- `docker-compose.yml`
  Lokal PostgreSQL container'i kaldirir. DB host portu `5433`.
- `PokemonAPI/PokemonAPI.csproj`
  Projenin package ve target framework tanimi. `net10.0`, `EF Core`, `Npgsql`, `Swagger` burada.
- `PokemonAPI/Program.cs`
  Uygulamayi ayaga kaldirir, DI kayitlarini yapar, DB baglantisini ekler, Swagger'i acar ve endpoint'leri map eder.
- `PokemonAPI/Features/Pokemons/Pokemon.cs`
  `Pokemon` entity'si. Veritabani satirinin C# karsiligi.
- `PokemonAPI/Features/Pokemons/PokemonService.cs`
  Pokemon use-case'lerini tasiyan service. Route ile EF sorgusunu ayiran katman bu.
- `PokemonAPI/Features/Pokemons/GetPokemonsResponseDto.cs`
  Liste response contract'i.
- `PokemonAPI/Features/Pokemons/GetPokemonByIdResponseDto.cs`
  Detay response contract'i.
- `PokemonAPI/Infrastructure/Persistence/PokemonDbContext.cs`
  EF Core context'i. Tablo mapping, kolon isimleri ve seed data burada.
- `PokemonAPI/Migrations/*.cs`
  Veritabani schema degisimleri.
- `PokemonAPI/Migrations/*Designer.cs`
  EF tarafindan uretilen destek dosyalari.
- `PokemonAPI/Migrations/PokemonDbContextModelSnapshot.cs`
  EF'nin mevcut model snapshot'i.
- `PokemonAPI/appsettings.json`
  Ortak config.
- `PokemonAPI/appsettings.Development.json`
  Development config'i. Lokal connection string burada.
- `PokemonAPI/Properties/launchSettings.json`
  Lokal calisma profilleri ve port ayarlari.
- `PokemonAPI/PokemonAPI.http`
  Manuel endpoint test dosyasi. Route degisirse ayni degisiklikte guncellenmeli.

## Su An Uygulama Ne Yapiyor

Sadece 2 endpoint var:

- `GET /pokemons`
  Tum Pokemon'lari `id` ve `name` ile listeler.
- `GET /pokemons/{id}`
  Tek bir Pokemon'u `id`, `name`, `type`, `age` ile dondurur.

Onemli nokta:

- Controller yok.
- Minimal API var.
- `PokemonService` var.
- `Pokemon` ile ilgili model/DTO/service ayni feature klasorunde.
- `DbContext` ayri persistence klasorunde.

Yani mimari su an sunu hedefliyor:

- HTTP concern -> `Program.cs`
- use-case/query orchestration -> `PokemonService`
- persistence mapping ve DB -> `PokemonDbContext`

Bu kucuk proje icin yeterince temiz. Hala basit, ama onceki "her sey Program.cs icinde" halinden daha dogru.

## Request Akisi

Bir istek geldiginde olan sey:

1. `Program.cs` endpoint'i esler.
2. Endpoint, `PokemonService`'i dependency injection ile alir.
3. `PokemonService`, `PokemonDbContext` uzerinden EF Core sorgusu calistirir.
4. Sonuc DTO olarak hazirlanir.
5. Endpoint `200 OK` veya `404 NotFound` doner.

Swift tarafindan bakarsan:

- `URLSession` ile cagiracagin endpoint `Program.cs` icinde tanimli
- response shape'i DTO ile tanimli
- service katmani route ile DB sorgusunu ayiriyor

## Dosya Bazinda Dikkat Edilecekler

### `PokemonAPI/Program.cs`

Bu dosya hala giris noktasi ve route mapping merkezi.

Burada:

- connection string okunuyor
- `PokemonDbContext` DI'a ekleniyor
- `PokemonService` DI'a ekleniyor
- Swagger sadece `Development` ortaminda aciliyor
- endpoint'ler tanimlaniyor

Dikkat:

- Bu dosya artik query yazmiyor; bu iyi.
- Yine de endpoint sayisi artarsa sisebilir.
- O noktada endpoint'leri ayri feature extension dosyalarina veya controller'a tasimak mantikli olur.
- `app.UseHttpsRedirection()` var. Lokal testte HTTP/HTTPS portlarina dikkat et.

### `PokemonAPI/Features/Pokemons/PokemonService.cs`

Bu dosya su an route ile persistence arasindaki ince uygulama katmani.

Burada:

- pokemon listeleme use-case'i
- id ile pokemon getirme use-case'i
- entity -> response DTO projection'i

var.

Dikkat:

- Bu servis business/use-case mantigi icin var.
- Controller yok diye business logic route'a geri kaymamali.
- Data access ayrica route'a geri tasinmamali.
- Su an repository abstraction yok; bu dogru. Tek use-case ve tek persistence yolu var.

### `PokemonAPI/Infrastructure/Persistence/PokemonDbContext.cs`

Bu dosya veritabani gerceginin merkezi.

Burada:

- tablo adi `pokemons`
- kolon isimleri `id`, `name`, `type`, `age`
- seed data

var.

Dikkat:

- `DbContext` feature business logic'i degil, persistence concern'udur.
- Bu yuzden `Features/Pokemons` altina konmadi; `Infrastructure/Persistence` altinda.
- `HasData(...)` migration uretir. Seed'i degistirince yeni migration gerekir.
- Sadece modeli degistirmek yetmez; schema degisikligi migration ile uygulanir.

### `PokemonAPI/Features/Pokemons/Pokemon.cs`

Bu entity sinifi.

Dikkat:

- Bu bir DB entity'si.
- API response modeli degil.
- DTO'larla ayni feature klasorunde durmasi kabul edilebilir; cunku hepsi ayni feature'a ait.
- Ama rolleri farkli: entity DB'yi, DTO API contract'ini temsil eder.

### `PokemonAPI/Features/Pokemons/*ResponseDto.cs`

Bunlar API'nin disariya verdigi response contract'lari.

Su an:

- `GetPokemonsResponseDto`
- `PokemonListItemResponseDto`
- `GetPokemonByIdResponseDto`
- `PokemonDetailResponseDto`

var.

Dikkat:

- Bunlar DB modeli degil.
- iOS tarafi bunlari tuketir.
- DB yapisi degisse bile API contract'ini korumak icin bu ayrim gerekir.

### `PokemonAPI/Migrations/*`

Bunlar veritabani degisim gecmisi.

Su an sira mantikli:

1. `InitialCreate`
2. `SeedTenPokemon`
3. `AddPokemonTypeAndAge`

Dikkat:

- Eski migration'lari kafana gore editleme.
- Ozellikle shared ya da production ortam varsa bu kotu pratiktir.
- Dogru akis:
  1. entity/context degisir
  2. yeni migration uretilir
  3. migration review edilir
  4. veritabanina uygulanir

### `PokemonAPI/appsettings.Development.json`

Lokal calisma icin DB connection string burada.

Dikkat:

- Lokal icin kabul edilebilir.
- Production icin secret'lar dosyada tutulmaz.
- Environment variable veya secure config gerekir.

### `docker-compose.yml`

PostgreSQL'i lokal ayaga kaldirir.

Dikkat:

- container portu `5432`
- host portu `5433`
- connection string buna gore yazilmis

## Kesinlikle Dikkat Edilmesi Gerekenler

### 1. Kod degistirmek veritabanini otomatik guncellemez

`Pokemon.cs` veya `PokemonDbContext.cs` degisti diye PostgreSQL kendiliginden degismez.

Gereken akis:

1. Model/context degistir
2. Migration olustur
3. Migration dosyasini review et
4. Veritabanina uygula

Bu adimi atlarsan kod ile DB schema'si kopar.

### 2. `Program.cs` route dosyasidir, service dosyasi degil

Yeni endpoint eklerken:

- EF sorgusunu route icine yigma
- projection ve orchestration'i route'a geri tasima
- use-case mantigini `PokemonService` benzeri bir service'de tut

Kucuk projede bile bu cizgiyi bozarsan dosya hizla tekrar dagilir.

### 3. Entity ile API response ayni sey degil

Bu ayrim artik var. Bunu bozma.

Buyurse:

- entity
- request DTO
- response DTO

ayrimi daha da onemli olur.

### 4. Seed data'yi hafife alma

`HasData(...)` migration gecmisinin parcasi.

Seed'i degistirince:

- yeni migration gerekebilir
- mevcut veriyi etkileyebilir

### 5. Production ve local config'i karistirma

`appsettings.Development.json` local icindir.

Buradaki:

- connection string
- port varsayimlari
- debug davranislari

production gercegi degil.

### 6. Su an test coverage yok

Bu repo su an unit/integration test icermiyor.

Bu ne demek:

- refactor yaparken sadece compile almak yeterli degil
- en azindan `.http` dosyasi ile manuel endpoint kontrolu yapmak gerekir
- business-critical davranis artarsa test projesi eklemek gerekir

## Bir iOS Developer Olarak Nerelere Bakmali?

Eger sadece API'yi anlamak istiyorsan su sira yeterli:

1. `PokemonAPI/Program.cs`
2. `PokemonAPI/Features/Pokemons/PokemonService.cs`
3. `PokemonAPI/Features/Pokemons/*ResponseDto.cs`
4. `PokemonAPI/Infrastructure/Persistence/PokemonDbContext.cs`
5. `PokemonAPI/PokemonAPI.http`

Bu 5 yere bakinca:

- endpoint ne
- ne donuyor
- veri nereden geliyor
- DB nasil map ediliyor

netlesir.

## Kisa Hukum

Bu repo su an:

- kucuk
- okunabilir
- gereksiz abstraction'dan kacinan
- minimal API kullanan
- feature + persistence ayrimini basit seviyede yapan

bir backend.

Tam kurumsal mimari degil. Ama su anki boyutu icin bu daha dogru; cunku gereksiz katman eklemekten daha iyi.
