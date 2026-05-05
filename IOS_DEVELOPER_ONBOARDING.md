# .NET Bilmeyen iOS Developer Icin Proje Ozeti

Bu repo su an tek bir kucuk `.NET` Web API projesi. Katmanli kurgu yok; `Minimal API + EF Core + PostgreSQL` olarak ilerliyor.

En kisa haliyle:

- `Program.cs`: Uygulamanin giris noktasi ve tum HTTP route'lar burada.
- `PokemonDbContext`: Veritabani erisim katmani.
- `Pokemon`: Veritabani/entity modeli.
- `Migrations`: Veritabani semasi ve seed degisiklik gecmisi.

Bu proje bir iOS geliştirici icin su sekilde dusunulebilir:

- `Program.cs` ~= `App`/`SceneDelegate` + router + endpoint tanimlari
- `MapGet(...)` ~= backend'deki route tanimi
- `DbContext` ~= hafif anlamda `Core Data stack/repository` benzeri veri erisim noktasi
- `Migration` ~= schema versioning + database upgrade script
- `appsettings.*.json` ~= environment bazli config

## Genel Mimari

Proje dosya duzeni:

- `AGENTS.md`
  Repo kurallari. Mimari beklentiyi burada yaziyor: business logic controller'da olmasin, data access service logic'e karismasin, migration'lar acik ve dikkatli olsun.
- `docker-compose.yml`
  Lokal PostgreSQL container'i kaldirir. DB burada `5433 -> 5432` map edilmis.
- `PokemonAPI/PokemonAPI.csproj`
  Projenin package ve target framework tanimi. `net10.0`, `EF Core`, `Npgsql`, `Swagger` burada.
- `PokemonAPI/Program.cs`
  Uygulama ayaga kalkiyor, DI container kuruluyor, DB baglantisi ekleniyor, Swagger aciliyor ve endpoint'ler tanimlaniyor.
- `PokemonAPI/Data/PokemonDbContext.cs`
  EF Core context'i. Tablo adi, kolon mapping'leri, seed data burada.
- `PokemonAPI/Models/Pokemon.cs`
  `Pokemon` entity'si. Veritabani satirinin C# karsiligi.
- `PokemonAPI/Migrations/*.cs`
  Veritabani semasi degisimleri. Her migration bir tarih damgali adim.
- `PokemonAPI/Migrations/*Designer.cs`
  EF tarafindan uretilen destek dosyalari. Elle duzenlemek normalde yanlis.
- `PokemonAPI/Migrations/PokemonDbContextModelSnapshot.cs`
  EF'nin mevcut modelin son halini tuttugu snapshot dosyasi. Migration uretimi bunu baz alir.
- `PokemonAPI/appsettings.json`
  Ortak config. Logging gibi temel ayarlar.
- `PokemonAPI/appsettings.Development.json`
  Development ortami icin config. Su an local PostgreSQL connection string burada.
- `PokemonAPI/Properties/launchSettings.json`
  Lokal calistirma profilleri. Hangi porttan acilacagi burada.
- `PokemonAPI/PokemonAPI.http`
  Manuel endpoint test dosyasi. Route degisirse burasi da guncellenmeli.

## Su An Uygulama Ne Yapiyor

Sadece 2 endpoint var:

- `GET /pokemons`
  Tum Pokemon'lari `id` ve `name` ile listeler.
- `GET /pokemons/{id}`
  Tek bir Pokemon'u `id`, `name`, `type`, `age` ile dondurur.

Onemli nokta:

- Controller yok.
- Service yok.
- Application/Domain/Infrastructure ayrimi yok.
- Business logic de route tanimi da `Program.cs` icinde.

Yani bu repo, dokumandaki hedef mimariye tam ulasmis degil. Kucuk oldugu icin okunmasi kolay ama buyurse hizla dagilir.

## Request Akisi

Bir istek geldiginde olan sey:

1. `Program.cs` endpoint'i esler.
2. `PokemonDbContext`, dependency injection ile endpoint'e verilir.
3. EF Core, PostgreSQL'e sorgu atar.
4. Sonuc `Results.Ok(...)` veya `Results.NotFound()` ile doner.

Swift tarafindan bakarsan:

- `URLSession` ile cagracagin endpoint burada `MapGet(...)` ile tanimli.
- JSON response shape backend'de anonim object ile kuruluyor.
- DTO sinifi yok; response direkt query icinde sekillendiriliyor.

## Dosya Bazinda Dikkat Edilecekler

### `PokemonAPI/Program.cs`

En kritik dosya bu.

Burada:

- connection string okunuyor
- `PokemonDbContext` DI'a ekleniyor
- Swagger sadece `Development` ortaminda aciliyor
- tum route'lar burada map ediliyor

Dikkat:

- Endpoint sayisi artarsa bu dosya cop olur.
- Query, response shape ve route ayni yerde. Bu uzun vadede kotu.
- Su an `AsNoTracking()` kullanimi dogru; read-only sorgular icin gereksiz tracking maliyetini kesiyor.
- `app.UseHttpsRedirection()` var. Lokal testte HTTP/HTTPS portlarina dikkat etmek gerekir.

### `PokemonAPI/Data/PokemonDbContext.cs`

Bu dosya veritabani gerceginin merkezi.

Burada:

- tablo adi `pokemons`
- kolon isimleri `id`, `name`, `type`, `age`
- seed data

Dikkat:

- `HasData(...)` migration uretir. Seed'i degistirince sadece kodu degistirmek yetmez; yeni migration da gerekir.
- `Type` ve `Name` zorunlu. `Age` su an `int`, yani nullable degil.
- Schema degisikligi burada yapilir ama veritabanina yansimasi migration ile olur. Sadece model degistirmek yetmez.

### `PokemonAPI/Models/Pokemon.cs`

Bu entity sinifi.

Dikkat:

- Bu bir API response modeli degil, veritabani entity'si.
- Proje buyurse entity ile response contract'ini ayirmak gerekir. Yoksa DB degisikligi API'yi kirar.

### `PokemonAPI/Migrations/*`

Bunlar veritabani degisim gecmisi.

Su an sira mantikli:

1. `InitialCreate`
2. `SeedTenPokemon`
3. `AddPokemonTypeAndAge`

Dikkat:

- Migration dosyalarini kafana gore duzeltmek riskli.
- Ozellikle yayinlanmis bir ortam varsa eski migration'i editlemek kotu pratiktir.
- Dogru akış: model/context degisir -> yeni migration uretilir -> migration review edilir -> uygulanir.

### `PokemonAPI/appsettings.Development.json`

Lokal calisma icin DB connection string burada.

Dikkat:

- Su an kullanici/sifre dosyada duruyor. Lokal icin tolere edilebilir, production icin yanlis.
- Production'da secret'lar environment variable veya secure config ile gitmeli.

### `docker-compose.yml`

PostgreSQL'i lokal ayaga kaldirir.

Dikkat:

- Container ic portu `5432`, host portu `5433`.
- Connection string buna gore yazilmis.
- Port cakismasi yasarsan ilk bakacagin yer burasi.

### `PokemonAPI/PokemonAPI.http`

Elle API denemek icin kullanilir.

Dikkat:

- Route eklersen veya degistirirsen bu dosya da ayni PR'da guncellenmeli.
- Bu repo kural olarak bunu bekliyor.

## Kesinlikle Dikkat Edilmesi Gerekenler

### 1. Kod degistirmek veritabanini otomatik guncellemez

`Pokemon.cs` veya `PokemonDbContext.cs` degisti diye PostgreSQL kendiliginden degismez.

Gereken akış:

1. Model/context degistir
2. Migration olustur
3. Migration dosyasini review et
4. Veritabanina uygula

Bu adimi atlarsan kod ile DB semasi birbirinden kopar.

### 2. `Program.cs` su an fazla sorumluluk tasiyor

Bu proje buyurse ilk bozulacak yer burasi.

Yeni endpoint eklerken:

- business logic'i route icine gommemek
- data access'i endpoint icine yaymamak
- ileride service/application layer'a tasimayi planlamak gerekir

Bugun kucuk diye sorun yok, yarin sorun olur.

### 3. Entity ile API response'i ayni sey degil

Su an response query icinde sekillendiriliyor. Bu, bu kadar kucuk proje icin kabul edilebilir.

Ama buyurse:

- entity
- request DTO
- response DTO

ayrimi gerekir. Aksi halde DB kolon degisikligi API contract'ini dogrudan bozar.

### 4. Seed data'yi hafife alma

`HasData(...)` sadece "ornek veri" degil; migration gecmisinin parcasi.

Seed'i degistirince:

- yeni migration gerekecegini
- mevcut veriyi etkileyebilecegini

unutma.

### 5. Production ve local config'i karistirma

`appsettings.Development.json` local icindir.

Buradaki:

- connection string
- port varsayimlari
- debug davranislari

production gercegi degil.

### 6. Su an test coverage yok

Repo icinde test projesi yok. Bu demek:

- degisikliklerin guvenligi dusuk
- regression yakalama sansi zayif

Ozellikle business-critical akislarda test eklemek gerekir.

## iOS Developer Olarak Neyi Nereden Baslayarak Okumalisin

En verimli okuma sirasi bu:

1. `PokemonAPI/Program.cs`
   Cunku uygulamanin ne sundugu tamamen burada gorunuyor.
2. `PokemonAPI/Data/PokemonDbContext.cs`
   Veritabani map'i ve seed mantigini burada anlarsin.
3. `PokemonAPI/Models/Pokemon.cs`
   Veri modeli cok basit.
4. `PokemonAPI/Migrations/`
   DB'nin nasil evrildigini burada gorursun.
5. `PokemonAPI/PokemonAPI.http`
   Endpoint'leri hemen elle deneyebilirsin.
6. `docker-compose.yml`
   Lokal DB nasil kalkiyor onu netlestirirsin.

## Lokal Calistirma Akisi

Kabaca akış:

1. `docker-compose up -d`
2. API projesini calistir
3. Gerekirse migration uygula
4. `.http` dosyasindan endpoint'leri dene

Bu repoda `launchSettings.json`'a gore local HTTP adresi:

- `http://localhost:5102`

## Duz Dille Sonuc

Bu repo su an ogretici seviyede temiz ve kucuk bir `.NET` API.

Iyi tarafi:

- okunmasi kolay
- ayaga kaldirmasi basit
- EF Core ve PostgreSQL entegrasyonu net

Zayif tarafi:

- gercek katmanli mimari yok
- endpoint logic'i `Program.cs`'de toplu
- test yok
- config/secrets ayrimi production seviyesinde degil

Yani "anlamasi kolay bir baslangic projesi" ama "buyumeye hazir saglam backend mimarisi" degil.
