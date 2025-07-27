import { useState } from 'react'

function CoinList({ coins, onCoinDeleted }) {
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(filter.toLowerCase()) ||
    coin.country.toLowerCase().includes(filter.toLowerCase()) ||
    coin.description?.toLowerCase().includes(filter.toLowerCase())
  )

  const sortedCoins = [...filteredCoins].sort((a, b) => {
    let aVal = a[sortBy]
    let bVal = b[sortBy]
    
    if (sortBy === 'year' || sortBy === 'purchasePrice' || sortBy === 'currentValue') {
      aVal = parseFloat(aVal) || 0
      bVal = parseFloat(bVal) || 0
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    }
    return aVal < bVal ? 1 : -1
  })

  const handleDelete = async (coinId) => {
    if (!window.confirm('Are you sure you want to delete this coin?')) {
      return
    }

    try {
      const response = await fetch(`/api/coins/${coinId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onCoinDeleted(coinId)
      } else {
        alert('Failed to delete coin')
      }
    } catch (error) {
      console.error('Error deleting coin:', error)
      alert('Error deleting coin')
    }
  }

  return (
    <div className="coin-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Coin Collection ({sortedCoins.length})</h2>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search coins..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ flex: '1', minWidth: '200px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="createdAt">Date Added</option>
          <option value="name">Name</option>
          <option value="year">Year</option>
          <option value="country">Country</option>
          <option value="currentValue">Current Value</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {sortedCoins.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          {filter ? 'No coins match your search.' : 'No coins in collection yet.'}
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Year</th>
                <th>Denomination</th>
                <th>Condition</th>
                <th>Current Value</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCoins.map(coin => (
                <tr key={coin.id}>
                  <td>
                    <strong>{coin.name}</strong>
                    {coin.description && (
                      <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                        {coin.description.length > 50 
                          ? `${coin.description.substring(0, 50)}...`
                          : coin.description
                        }
                      </div>
                    )}
                  </td>
                  <td>{coin.country}</td>
                  <td>{coin.year}</td>
                  <td>{coin.denomination}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem',
                      backgroundColor: getConditionColor(coin.condition),
                      color: 'white'
                    }}>
                      {coin.condition?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {coin.currentValue ? (
                      <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                        ${parseFloat(coin.currentValue).toFixed(2)}
                      </span>
                    ) : (
                      <span style={{ color: '#bdc3c7' }}>N/A</span>
                    )}
                  </td>
                  <td>{coin.user?.name || 'Unknown'}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn btn-secondary"
                        onClick={() => alert(`Viewing details for ${coin.name}`)}
                      >
                        View
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(coin.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function getConditionColor(condition) {
  const colors = {
    'POOR': '#e74c3c',
    'FAIR': '#f39c12',
    'GOOD': '#f1c40f',
    'VERY_GOOD': '#2ecc71',
    'FINE': '#3498db',
    'VERY_FINE': '#9b59b6',
    'EXTREMELY_FINE': '#1abc9c',
    'ALMOST_UNCIRCULATED': '#34495e',
    'MINT_STATE': '#27ae60',
    'PROOF': '#8e44ad'
  }
  return colors[condition] || '#95a5a6'
}

export default CoinList