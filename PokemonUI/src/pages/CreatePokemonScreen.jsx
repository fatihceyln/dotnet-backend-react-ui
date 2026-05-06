import { useState } from 'react'
import { fetchJson, showBackendError } from '../api'

export function CreatePokemonScreen({ accessToken, onCreated }) {
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
