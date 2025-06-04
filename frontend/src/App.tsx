import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface PlayerData {
  id: string
  name: string
  // Add other properties based on what your Go API returns
  [key: string]: any
}

function App() {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [playerId, setPlayerId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlayerData = async () => {
    if (!playerId.trim()) {
      setError('Please enter a player ID')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:3080/api/fpl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player_id: playerId }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setPlayerData(data)
      } else {
        const errorText = await response.text()
        setError(`Failed to fetch player data: ${errorText}`)
      }
    } catch (error) {
      setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const clearData = () => {
    setPlayerData(null)
    setError(null)
    setPlayerId('')
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      
      <h1>FPL Wrapped</h1>
      <p>Enter a Fantasy Premier League player ID to get their data</p>
      
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <input 
            type="text" 
            value={playerId} 
            onChange={(e) => setPlayerId(e.target.value)}
            placeholder="Enter Player ID (e.g., 123456)"
            style={{ marginRight: '0.5rem', padding: '0.5rem' }}
            disabled={loading}
          />
          <button 
            onClick={fetchPlayerData}
            disabled={loading || !playerId.trim()}
            style={{ 
              marginRight: '0.5rem',
              opacity: loading || !playerId.trim() ? 0.6 : 1 
            }}
          >
            {loading ? 'Loading...' : 'Get Player Data'}
          </button>
          <button onClick={clearData} disabled={loading}>
            Clear
          </button>
        </div>

        {error && (
          <div style={{ 
            color: '#ff6b6b', 
            marginBottom: '1rem',
            padding: '0.5rem',
            border: '1px solid #ff6b6b',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 107, 107, 0.1)'
          }}>
            {error}
          </div>
        )}

        {playerData && (
          <div style={{ marginTop: '1rem' }}>
            <h3>Player Data Retrieved Successfully!</h3>
            <div style={{
              textAlign: 'left',
              backgroundColor: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              color: '#333'
            }}>
              <pre style={{ margin: 0, fontSize: '0.9rem' }}>
                {JSON.stringify(playerData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
          <p>
            <strong>Backend Status:</strong> {loading ? 'Connecting...' : 'Ready'}
          </p>
          <p>
            <strong>API Endpoint:</strong> http://localhost:3080/api/fpl
          </p>
          <p>
            Make sure your Go backend is running on port 3080
          </p>
        </div>
      </div>

      <p className="read-the-docs">
        This app demonstrates React frontend communicating with Go backend
      </p>
    </>
  )
}

export default App
