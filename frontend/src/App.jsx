import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// API base URL
const API_BASE = '/api'

function App() {
  const [coins, setCoins] = useState([])
  const [types, setTypes] = useState([])
  const [mints, setMints] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('collection')

  // Form state for adding coins
  const [newCoin, setNewCoin] = useState({
    year: new Date().getFullYear(),
    typeId: '',
    mintId: '',
    condition: 'Good',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [coinsRes, typesRes, mintsRes, collectionsRes] = await Promise.all([
        axios.get(`${API_BASE}/coins`),
        axios.get(`${API_BASE}/types`),
        axios.get(`${API_BASE}/mints`),
        axios.get(`${API_BASE}/collections`)
      ])
      
      setCoins(coinsRes.data.coins || [])
      setTypes(typesRes.data || [])
      setMints(mintsRes.data || [])
      setCollections(collectionsRes.data.collections || [])
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Make sure the backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  const addToCollection = async (coinId) => {
    try {
      await axios.post(`${API_BASE}/collections`, {
        coinId,
        condition: 'Good',
        quantity: 1
      })
      loadData() // Reload data to update collection
    } catch (err) {
      console.error('Error adding to collection:', err)
      setError('Failed to add coin to collection')
    }
  }

  const createAndAddCoin = async (e) => {
    e.preventDefault()
    try {
      // First create the coin if it doesn't exist
      const coinResponse = await axios.post(`${API_BASE}/coins`, newCoin)
      // Then add it to collection
      await addToCollection(coinResponse.data.id)
      // Reset form
      setNewCoin({
        year: new Date().getFullYear(),
        typeId: '',
        mintId: '',
        condition: 'Good',
        notes: ''
      })
    } catch (err) {
      console.error('Error creating/adding coin:', err)
      if (err.response?.status === 409) {
        // Coin already exists, try to find it and add to collection
        try {
          const existingCoin = coins.find(c => 
            c.year === parseInt(newCoin.year) && 
            c.typeId === parseInt(newCoin.typeId) && 
            c.mintId === parseInt(newCoin.mintId)
          )
          if (existingCoin) {
            await addToCollection(existingCoin.id)
            setNewCoin({
              year: new Date().getFullYear(),
              typeId: '',
              mintId: '',
              condition: 'Good',
              notes: ''
            })
          }
        } catch (err2) {
          setError('Failed to add existing coin to collection')
        }
      } else {
        setError('Failed to create coin')
      }
    }
  }

  const removeFromCollection = async (collectionId) => {
    try {
      await axios.delete(`${API_BASE}/collections/${collectionId}`)
      loadData() // Reload data to update collection
    } catch (err) {
      console.error('Error removing from collection:', err)
      setError('Failed to remove coin from collection')
    }
  }

  if (loading) {
    return <div className="loading">Loading CoinCollector...</div>
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🪙 CoinCollector</h1>
        <p>Track your US coin collection</p>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <nav className="tabs">
        <button 
          className={activeTab === 'collection' ? 'active' : ''}
          onClick={() => setActiveTab('collection')}
        >
          My Collection ({collections.length})
        </button>
        <button 
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => setActiveTab('add')}
        >
          Add Coins
        </button>
        <button 
          className={activeTab === 'browse' ? 'active' : ''}
          onClick={() => setActiveTab('browse')}
        >
          Browse All Coins ({coins.length})
        </button>
      </nav>

      <main className="content">
        {activeTab === 'collection' && (
          <div className="collection-tab">
            <h2>My Collection</h2>
            {collections.length === 0 ? (
              <p>Your collection is empty. Add some coins to get started!</p>
            ) : (
              <div className="coins-grid">
                {collections.map(item => (
                  <div key={item.id} className="coin-card collection-item">
                    <h3>{item.coin.type.name}</h3>
                    <p><strong>Year:</strong> {item.coin.year}</p>
                    <p><strong>Mint:</strong> {item.coin.mint.name} ({item.coin.mint.mintMark || 'P'})</p>
                    <p><strong>Condition:</strong> {item.condition}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCollection(item.id)}
                    >
                      Remove from Collection
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="add-tab">
            <h2>Add Coin to Collection</h2>
            <form onSubmit={createAndAddCoin} className="add-coin-form">
              <div className="form-group">
                <label htmlFor="year">Year:</label>
                <input
                  type="number"
                  id="year"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={newCoin.year}
                  onChange={(e) => setNewCoin({...newCoin, year: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="typeId">Coin Type:</label>
                <select
                  id="typeId"
                  value={newCoin.typeId}
                  onChange={(e) => setNewCoin({...newCoin, typeId: e.target.value})}
                  required
                >
                  <option value="">Select a coin type</option>
                  {types.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.denomination})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="mintId">Mint:</label>
                <select
                  id="mintId"
                  value={newCoin.mintId}
                  onChange={(e) => setNewCoin({...newCoin, mintId: e.target.value})}
                  required
                >
                  <option value="">Select a mint</option>
                  {mints.map(mint => (
                    <option key={mint.id} value={mint.id}>
                      {mint.name} ({mint.mintMark || 'P'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="condition">Condition:</label>
                <select
                  id="condition"
                  value={newCoin.condition}
                  onChange={(e) => setNewCoin({...newCoin, condition: e.target.value})}
                >
                  <option value="Poor">Poor</option>
                  <option value="Fair">Fair</option>
                  <option value="Good">Good</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Fine">Fine</option>
                  <option value="Very Fine">Very Fine</option>
                  <option value="Extremely Fine">Extremely Fine</option>
                  <option value="About Uncirculated">About Uncirculated</option>
                  <option value="Uncirculated">Uncirculated</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes (optional):</label>
                <textarea
                  id="notes"
                  value={newCoin.notes}
                  onChange={(e) => setNewCoin({...newCoin, notes: e.target.value})}
                  placeholder="Any additional notes about this coin..."
                />
              </div>

              <button type="submit" className="add-btn">
                Add to Collection
              </button>
            </form>
          </div>
        )}

        {activeTab === 'browse' && (
          <div className="browse-tab">
            <h2>All Available Coins</h2>
            <div className="coins-grid">
              {coins.map(coin => (
                <div key={coin.id} className="coin-card">
                  <h3>{coin.type.name}</h3>
                  <p><strong>Year:</strong> {coin.year}</p>
                  <p><strong>Mint:</strong> {coin.mint.name} ({coin.mint.mintMark || 'P'})</p>
                  <p><strong>Condition:</strong> {coin.condition}</p>
                  {coin.notes && <p><strong>Notes:</strong> {coin.notes}</p>}
                  <button 
                    className="add-btn"
                    onClick={() => addToCollection(coin.id)}
                  >
                    Add to Collection
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
