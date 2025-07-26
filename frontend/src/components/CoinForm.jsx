import { useState } from 'react'

const COIN_CONDITIONS = [
  'POOR', 'FAIR', 'GOOD', 'VERY_GOOD', 'FINE',
  'VERY_FINE', 'EXTREMELY_FINE', 'ALMOST_UNCIRCULATED',
  'MINT_STATE', 'PROOF'
]

function CoinForm({ users, onCoinAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    year: '',
    denomination: '',
    mintage: '',
    composition: '',
    diameter: '',
    weight: '',
    description: '',
    condition: 'GOOD',
    purchasePrice: '',
    currentValue: '',
    acquired: '',
    imageUrl: '',
    notes: '',
    userId: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (!formData.name.trim()) {
      setError('Coin name is required')
      setLoading(false)
      return
    }
    
    if (!formData.country.trim()) {
      setError('Country is required')
      setLoading(false)
      return
    }
    
    if (!formData.year || isNaN(formData.year)) {
      setError('Valid year is required')
      setLoading(false)
      return
    }
    
    if (!formData.userId) {
      setError('Please select an owner')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/coins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        onCoinAdded(result.data)
        setFormData({
          name: '',
          country: '',
          year: '',
          denomination: '',
          mintage: '',
          composition: '',
          diameter: '',
          weight: '',
          description: '',
          condition: 'GOOD',
          purchasePrice: '',
          currentValue: '',
          acquired: '',
          imageUrl: '',
          notes: '',
          userId: ''
        })
        alert('Coin added successfully!')
      } else {
        setError(result.message || 'Failed to add coin')
      }
    } catch (error) {
      console.error('Error adding coin:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="coin-form">
      <h2>Add New Coin</h2>
      
      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginBottom: '1rem',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        {/* Basic Information */}
        <div className="form-row">
          <div className="form-group">
            <label>Coin Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Morgan Silver Dollar"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Country *</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g., United States"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Year *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1"
              max={new Date().getFullYear()}
              placeholder="e.g., 1921"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Denomination</label>
            <input
              type="text"
              name="denomination"
              value={formData.denomination}
              onChange={handleChange}
              placeholder="e.g., 1 Dollar, 50 Cents"
            />
          </div>
        </div>

        {/* Physical Properties */}
        <div className="form-row">
          <div className="form-group">
            <label>Mintage</label>
            <input
              type="number"
              name="mintage"
              value={formData.mintage}
              onChange={handleChange}
              placeholder="Number of coins minted"
            />
          </div>
          
          <div className="form-group">
            <label>Composition</label>
            <input
              type="text"
              name="composition"
              value={formData.composition}
              onChange={handleChange}
              placeholder="e.g., 90% Silver, 10% Copper"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Diameter (mm)</label>
            <input
              type="number"
              step="0.1"
              name="diameter"
              value={formData.diameter}
              onChange={handleChange}
              placeholder="e.g., 38.1"
            />
          </div>
          
          <div className="form-group">
            <label>Weight (grams)</label>
            <input
              type="number"
              step="0.01"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g., 26.73"
            />
          </div>
        </div>

        {/* Description and Condition */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the coin..."
          />
        </div>

        <div className="form-group">
          <label>Condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            {COIN_CONDITIONS.map(condition => (
              <option key={condition} value={condition}>
                {condition.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Financial Information */}
        <div className="form-row">
          <div className="form-group">
            <label>Purchase Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="e.g., 45.00"
            />
          </div>
          
          <div className="form-group">
            <label>Current Value ($)</label>
            <input
              type="number"
              step="0.01"
              name="currentValue"
              value={formData.currentValue}
              onChange={handleChange}
              placeholder="e.g., 52.00"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date Acquired</label>
            <input
              type="date"
              name="acquired"
              value={formData.acquired}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Owner *</label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            >
              <option value="">Select owner...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/coin-image.jpg"
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Personal notes about this coin..."
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Coin'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CoinForm