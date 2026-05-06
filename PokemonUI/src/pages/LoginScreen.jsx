import { useState } from 'react'

export function LoginScreen({ onLogin, isSubmitting }) {
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
