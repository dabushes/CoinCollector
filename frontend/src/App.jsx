import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// Components
import CoinList from './components/CoinList'
import CoinForm from './components/CoinForm'
import UserList from './components/UserList'

function App() {
  const [coins, setCoins] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch initial data
  useEffect(() => {
    Promise.all([
      fetch('/api/coins').then(res => res.json()),
      fetch('/api/users').then(res => res.json())
    ])
    .then(([coinsData, usersData]) => {
      setCoins(coinsData.data || [])
      setUsers(usersData.data || [])
      setLoading(false)
    })
    .catch(err => {
      setError('Failed to load data')
      setLoading(false)
      console.error('Error fetching data:', err)
    })
  }, [])

  const handleCoinAdded = (newCoin) => {
    setCoins(prev => [newCoin, ...prev])
  }

  const handleCoinDeleted = (coinId) => {
    setCoins(prev => prev.filter(coin => coin.id !== coinId))
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading CoinCollector...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <h1>
              <span className="coin-icon">🪙</span>
              CoinCollector
            </h1>
            <nav>
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/coins" className="nav-link">Coins</Link>
              <Link to="/add-coin" className="nav-link">Add Coin</Link>
              <Link to="/users" className="nav-link">Users</Link>
            </nav>
          </div>
        </header>

        <main className="app-main">
          <div className="container">
            <Routes>
              <Route path="/" element={
                <Dashboard coins={coins} users={users} />
              } />
              <Route path="/coins" element={
                <CoinList 
                  coins={coins} 
              onCoinDeleted={handleCoinDeleted}
                />
              } />
              <Route path="/add-coin" element={
                <CoinForm 
                  users={users}
                  onCoinAdded={handleCoinAdded}
                />
              } />
              <Route path="/users" element={
                <UserList users={users} />
              } />
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>&copy; 2024 CoinCollector. Built with React and Express.</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

// Dashboard component
function Dashboard({ coins, users }) {
  const totalCoins = coins.length
  const totalUsers = users.length
  const totalValue = coins.reduce((sum, coin) => sum + (parseFloat(coin.currentValue) || 0), 0)
  const recentCoins = coins.slice(0, 5)

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Coins</h3>
          <p className="stat-number">{totalCoins}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Collection Value</h3>
          <p className="stat-number">${totalValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="recent-coins">
        <h3>Recent Coins</h3>
        {recentCoins.length > 0 ? (
          <div className="coin-grid">
            {recentCoins.map(coin => (
              <div key={coin.id} className="coin-card">
                <h4>{coin.name}</h4>
                <p>{coin.country} • {coin.year}</p>
                <p className="coin-value">${coin.currentValue || 'N/A'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No coins in collection yet.</p>
        )}
      </div>
    </div>
  )
}

export default App