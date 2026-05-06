import { useState } from 'react'
import './App.css'
import { fetchJson, showBackendError } from './api'
import { LoginScreen } from './pages/LoginScreen'
import { PokemonListScreen } from './pages/PokemonListScreen'
import { PokemonDetailScreen } from './pages/PokemonDetailScreen'
import { CreatePokemonScreen } from './pages/CreatePokemonScreen'

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
