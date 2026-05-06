import { useEffect, useState } from 'react'
import { fetchJson } from '../api'

export function PokemonListScreen({ onSelectPokemon, refreshKey }) {
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
