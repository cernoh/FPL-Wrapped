import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [playerData, setPlayerData] = useState(null)
  const [playerId, setPlayerId] = useState('')

  const fetchPlayerData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/fpl', {
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
        console.error('Failed to fetch player data')
      }
    } catch (error) {
      console.error('Error:', error)
    }
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
      <div className="card">
        <input 
          type="text" 
          value={playerId} 
          onChange={(e) => setPlayerId(e.target.value)}
          placeholder="Enter Player ID"
        />
        <button onClick={fetchPlayerData}>
          Get Player Data
        </button>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        {playerData && (
          <pre>{JSON.stringify(playerData, null, 2)}</pre>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
