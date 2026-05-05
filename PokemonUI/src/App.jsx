import { useEffect, useState } from 'react'
import './App.css'

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

        const response = await fetch(`/pokemons/${pokemonId}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Pokemon detayi alinamadi.')
        }

        const result = await response.json()
        setPokemon(result.data ?? null)
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setErrorMessage('Pokemon detayi yuklenemedi.')
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
      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
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

function App() {
  const [pokemons, setPokemons] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPokemonId, setSelectedPokemonId] = useState(null)
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

        const response = await fetch(requestUrl, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Pokemon listesi alinamadi.')
        }

        const result = await response.json()
        setPokemons(Array.isArray(result.data) ? result.data : [])
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setErrorMessage('Backend erisilemedi veya gecersiz cevap dondu.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPokemons()

    return () => {
      controller.abort()
    }
  }, [searchTerm])

  return (
    <main className="app-shell">
      <section className="pokemon-panel">
        <p className="eyebrow">Local backend</p>
        {selectedPokemonId === null ? (
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
                      onClick={() => setSelectedPokemonId(pokemon.id)}
                    >
                      <span className="pokemon-id">#{pokemon.id}</span>
                      <span className="pokemon-name">{pokemon.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <PokemonDetailScreen
            pokemonId={selectedPokemonId}
            onBack={() => setSelectedPokemonId(null)}
          />
        )}
      </section>
    </main>
  )
}

export default App
