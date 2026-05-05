import { useEffect, useState } from 'react'
import './App.css'

function App() {
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
              <li key={pokemon.id} className="pokemon-row">
                <span className="pokemon-id">#{pokemon.id}</span>
                <span className="pokemon-name">{pokemon.name}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  )
}

export default App
