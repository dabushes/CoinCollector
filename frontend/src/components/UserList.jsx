import { useState, useEffect } from 'react'

function UserList({ users }) {
  const [userStats, setUserStats] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch stats for each user
    const fetchUserStats = async () => {
      setLoading(true)
      const stats = {}
      
      try {
        await Promise.all(
          users.map(async (user) => {
            try {
              const response = await fetch(`/api/users/${user.id}/stats`)
              if (response.ok) {
                const data = await response.json()
                stats[user.id] = data.data
              }
            } catch (error) {
              console.error(`Error fetching stats for user ${user.id}:`, error)
            }
          })
        )
        
        setUserStats(stats)
      } catch (error) {
        console.error('Error fetching user statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    if (users.length > 0) {
      fetchUserStats()
    }
  }, [users])

  const [newUser, setNewUser] = useState({ name: '', email: '' })
  const [showAddForm, setShowAddForm] = useState(false)
  const [addingUser, setAddingUser] = useState(false)

  const handleAddUser = async (e) => {
    e.preventDefault()
    setAddingUser(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      })

      if (response.ok) {
        alert('User added successfully!')
        setNewUser({ name: '', email: '' })
        setShowAddForm(false)
        // Note: In a real app, you'd update the users list here
        window.location.reload() // Simple refresh for demo
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add user')
      }
    } catch (error) {
      console.error('Error adding user:', error)
      alert('Network error. Please try again.')
    } finally {
      setAddingUser(false)
    }
  }

  return (
    <div className="user-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Users ({users.length})</h2>
        <button 
          className="btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showAddForm && (
        <div className="form-container" style={{ marginBottom: '2rem' }}>
          <h3>Add New User</h3>
          <form onSubmit={handleAddUser}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter user's name"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn"
                disabled={addingUser || !newUser.email}
              >
                {addingUser ? 'Adding...' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          No users found. Add some users to get started.
        </div>
      ) : (
        <div className="coin-grid">
          {users.map(user => {
            const stats = userStats[user.id]
            
            return (
              <div key={user.id} className="coin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#2c3e50' }}>
                      {user.name || 'Unnamed User'}
                    </h3>
                    <p style={{ margin: '0.25rem 0', color: '#7f8c8d' }}>
                      {user.email}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#95a5a6' }}>
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {user._count && (
                    <span style={{
                      background: '#3498db',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {user._count.coins} coins
                    </span>
                  )}
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '1rem', color: '#7f8c8d' }}>
                    Loading stats...
                  </div>
                ) : stats ? (
                  <div className="user-stats">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
                          {stats.totalCoins}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#7f8c8d' }}>
                          Total Coins
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                          ${parseFloat(stats.totalValue || 0).toFixed(2)}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#7f8c8d' }}>
                          Collection Value
                        </p>
                      </div>
                    </div>

                    {stats.coinsByCountry && stats.coinsByCountry.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 'bold', color: '#2c3e50' }}>
                          Top Countries:
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {stats.coinsByCountry.slice(0, 3).map((country, index) => (
                            <span 
                              key={index}
                              style={{
                                background: '#ecf0f1',
                                color: '#2c3e50',
                                padding: '0.125rem 0.375rem',
                                borderRadius: '8px',
                                fontSize: '0.75rem'
                              }}
                            >
                              {country.country} ({country._count.country})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                        onClick={() => alert(`Viewing detailed profile for ${user.name || user.email}`)}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem', color: '#7f8c8d' }}>
                    No statistics available
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UserList