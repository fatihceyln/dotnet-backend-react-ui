import { useEffect, useState } from 'react'
import './App.css'

async function readErrorMessage(response) {
  const { status, statusText } = response

  try {
    const contentType = response.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      const body = await response.json()
      const message =
        body.message ||
        body.error ||
        (body.errors && Object.values(body.errors).flat().join('\n')) ||
        [body.title, body.detail].filter(Boolean).join(': ')

      if (message) {
        return status >= 500 ? `HTTP ${status}: ${message}` : message
      }
    } else {
      const text = (await response.text()).trim()
      if (text) {
        return status >= 500 ? `HTTP ${status}: ${text}` : text
      }
    }
  } catch {}

  return status >= 500
    ? `HTTP ${status} ${statusText}`.trim()
    : statusText || 'Istek basarisiz oldu.'
}

async function fetchJson(url, options = {}) {
  const headers = new Headers(options.headers ?? {})
  const hasBody = options.body !== undefined

  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return null
  }

  return response.json()
}

function showBackendError(error) {
  window.alert(error instanceof Error ? error.message : 'Beklenmeyen bir hata olustu.')
}

function LoginScreen({ onLogin, isSubmitting }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onLogin({
      username,
      password,
    })
  }

  return (
    <>
      <p className="eyebrow">Local backend</p>
      <h1>Giris Yap</h1>
      <p className="description">PokemonUI kullanmak icin backend uzerinden giris yap.</p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field-group">
          <span>Kullanici adi</span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="field-group">
          <span>Sifre</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? 'Giris yapiliyor...' : 'Giris yap'}
        </button>
      </form>
    </>
  )
}

function PokemonListScreen({ onSelectPokemon, refreshKey }) {
  const [pokemons, setPokemons] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPokemons() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const trimmedSearchTerm = searchTerm.trim()
        const requestUrl = trimmedSearchTerm
          ? `/pokemons?search=${encodeURIComponent(trimmedSearchTerm)}`
          : '/pokemons'

        const result = await fetchJson(requestUrl, {
          signal: controller.signal,
        })

        setPokemons(Array.isArray(result?.data) ? result.data : [])
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }

        setErrorMessage(
          error instanceof Error ? error.message : 'Pokemon listesi alinamadi.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadPokemons()

    return () => {
      controller.abort()
    }
  }, [refreshKey, searchTerm])

  return (
    <>
      <h1>Pokemon Listesi</h1>
      <p className="description">Pokemon isimleri ve id degerleri.</p>

      <input
        type="search"
        className="search-input"
        placeholder="Pokemon ara"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {isLoading ? <p className="status-message">Yukleniyor...</p> : null}

      {!isLoading && errorMessage ? (
        <p className="status-message error">{errorMessage}</p>
      ) : null}

      {!isLoading && !errorMessage && pokemons.length === 0 ? (
        <p className="status-message">Gosterilecek pokemon yok.</p>
      ) : null}

      {!isLoading && !errorMessage && pokemons.length > 0 ? (
        <ul className="pokemon-list">
          {pokemons.map((pokemon) => (
            <li key={pokemon.id}>
              <button
                type="button"
                className="pokemon-row"
                onClick={() => onSelectPokemon(pokemon.id)}
              >
                <span className="pokemon-id">#{pokemon.id}</span>
                <span className="pokemon-name">{pokemon.name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}

function PokemonDetailScreen({ pokemonId, onBack }) {
  const [pokemon, setPokemon] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPokemonDetail() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const result = await fetchJson(`/pokemons/${pokemonId}`, {
          signal: controller.signal,
        })

        setPokemon(result?.data ?? null)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }

        setErrorMessage(
          error instanceof Error ? error.message : 'Pokemon detayi yuklenemedi.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadPokemonDetail()

    return () => {
      controller.abort()
    }
  }, [pokemonId])

  return (
    <>
      <button type="button" className="back-button" onClick={onBack}>
        Listeye don
      </button>

      <h1>Pokemon Detayi</h1>
      <p className="description">Secilen pokemon icin temel bilgiler.</p>

      {isLoading ? <p className="status-message">Yukleniyor...</p> : null}

      {!isLoading && errorMessage ? (
        <p className="status-message error">{errorMessage}</p>
      ) : null}

      {!isLoading && !errorMessage && pokemon ? (
        <div className="detail-card">
          <div className="detail-row">
            <span className="detail-label">Id</span>
            <span className="detail-value">#{pokemon.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Isim</span>
            <span className="detail-value">{pokemon.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Tip</span>
            <span className="detail-value">{pokemon.type}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Yas</span>
            <span className="detail-value">{pokemon.age}</span>
          </div>
        </div>
      ) : null}
    </>
  )
}

function CreatePokemonScreen({ accessToken, onCreated }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [age, setAge] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setIsSubmitting(true)

      await fetchJson('/pokemons', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          type,
          age: age === '' ? '' : Number(age),
        }),
      })

      setName('')
      setType('')
      setAge('')
      onCreated()
    } catch (error) {
      showBackendError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h1>Pokemon Olustur</h1>
      <p className="description">Yeni pokemon eklemek icin backend istegi gonder.</p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field-group">
          <span>Isim</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="field-group">
          <span>Tip</span>
          <input
            type="text"
            value={type}
            onChange={(event) => setType(event.target.value)}
          />
        </label>

        <label className="field-group">
          <span>Yas</span>
          <input
            type="number"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </label>

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? 'Kaydediliyor...' : 'Pokemon olustur'}
        </button>
      </form>
    </>
  )
}

function App() {
  const [currentView, setCurrentView] = useState('login')
  const [auth, setAuth] = useState(null)
  const [selectedPokemonId, setSelectedPokemonId] = useState(null)
  const [pokemonListRefreshKey, setPokemonListRefreshKey] = useState(0)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  async function handleLogin(credentials) {
    try {
      setIsLoggingIn(true)

      const response = await fetchJson('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })

      if (!response || typeof response.accessToken !== 'string') {
        throw new Error('Gecersiz backend cevabi alindi.')
      }

      setAuth({
        accessToken: response.accessToken,
        username: credentials.username.trim(),
      })
      setCurrentView('list')
    } catch (error) {
      showBackendError(error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  function handleLogout() {
    setAuth(null)
    setSelectedPokemonId(null)
    setCurrentView('login')
  }

  function handleSelectPokemon(pokemonId) {
    setSelectedPokemonId(pokemonId)
    setCurrentView('detail')
  }

  function handlePokemonCreated() {
    setSelectedPokemonId(null)
    setCurrentView('list')
    setPokemonListRefreshKey((currentValue) => currentValue + 1)
  }

  if (!auth) {
    return (
      <main className="app-shell">
        <section className="pokemon-panel auth-panel">
          <LoginScreen onLogin={handleLogin} isSubmitting={isLoggingIn} />
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="pokemon-panel">
        <header className="panel-header">
          <p className="eyebrow">Local backend</p>

          <div className="panel-header-right">
            <p className="user-name">{auth.username}</p>

            <div className="header-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setSelectedPokemonId(null)
                  setCurrentView('list')
                }}
              >
                Liste
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setCurrentView('create')}
              >
                Olustur
              </button>
              <button type="button" className="ghost-button" onClick={handleLogout}>
                Cikis
              </button>
            </div>
          </div>
        </header>

        {currentView === 'list' ? (
          <PokemonListScreen
            onSelectPokemon={handleSelectPokemon}
            refreshKey={pokemonListRefreshKey}
          />
        ) : null}

        {currentView === 'detail' && selectedPokemonId !== null ? (
          <PokemonDetailScreen
            pokemonId={selectedPokemonId}
            onBack={() => {
              setSelectedPokemonId(null)
              setCurrentView('list')
            }}
          />
        ) : null}

        {currentView === 'create' ? (
          <CreatePokemonScreen
            accessToken={auth.accessToken}
            onCreated={handlePokemonCreated}
          />
        ) : null}
      </section>
    </main>
  )
}

export default App
