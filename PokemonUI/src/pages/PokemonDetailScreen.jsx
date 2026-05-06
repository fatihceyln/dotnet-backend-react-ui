import { useEffect, useState } from 'react'
import { fetchJson } from '../api'

export function PokemonDetailScreen({ pokemonId, onBack }) {
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
