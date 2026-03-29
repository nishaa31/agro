import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [tab, setTab]         = useState('login')   // 'login' | 'register'
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [password, setPassword] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError]     = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!phone || !password) {
      setError('Phone number and password required da!')
      return
    }

    // Save user to localStorage — replace with real API later
    localStorage.setItem('agropestro_user', JSON.stringify({
      name    : name || 'Farmer',
      phone,
      location: location || 'Tamil Nadu',
    }))
    navigate('/home')
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')

    if (!name || !phone || !password) {
      setError('All fields required da!')
      return
    }

    localStorage.setItem('agropestro_user', JSON.stringify({ name, phone, location }))
    navigate('/')
  }

  return (
    <div className="login-page">
      {/* Left brand panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-name">AgroPestro</div>
          <div className="brand-tag">Smart Wheat Intelligence Platform</div>
        </div>

        <div className="login-hero">
          <div className="hero-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
              <path d="M12 22V12M12 12C12 12 7 7 7 3a5 5 0 0 1 10 0c0 4-5 9-5 9z"/>
              <path d="M12 12C12 12 9 14 7 17"/>
              <path d="M12 12C12 12 15 14 17 17"/>
            </svg>
          </div>
          <h1 className="hero-title">உங்கள் பயிரை<br />காப்போம்! 🌾</h1>
          <p className="hero-desc">
            AI-powered disease detection, yield prediction,
            and real-time farming advice — all in Tamil for Indian farmers.
          </p>

          <div className="feature-list">
            {[
              'Tamil Voice AI — கேள்வி கேட்டால் பதில் கிடைக்கும்',
              'Disease Detection from crop photos instantly',
              'Yield Prediction using soil & weather data',
              'Market prices + best time to sell harvest',
            ].map((f, i) => (
              <div key={i} className="feature-item">
                <div className="feature-tick">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="farmer-quote">
          <p>"AgroPestro என் பயிரில் நோய் வருவதற்கு முன்பே எனக்கு எச்சரிக்கை செய்தது!"</p>
          <span>— Murugan, Wheat Farmer, Thanjavur</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-right">
        <div className="login-form-box">
          <div className="form-top">
            <h2>{tab === 'login' ? 'Welcome back 👋' : 'Create account 🌱'}</h2>
            <p>{tab === 'login' ? 'Login to manage your farm dashboard' : 'Join AgroPestro for free'}</p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>
              Login
            </button>
            <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>
              Register
            </button>
          </div>

          <form onSubmit={tab === 'login' ? handleLogin : handleRegister}>
            {/* Name — register only */}
            {tab === 'register' && (
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrap">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="உங்கள் பெயர்"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Phone */}
            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4a2 2 0 0 1 1.98-2.18h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.92-.92a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Location — register only */}
            {tab === 'register' && (
              <div className="form-group">
                <label>Location</label>
                <div className="input-wrap">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="e.g. Madurai, Tamil Nadu"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </div>
              </div>
            )}

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn-submit">
              {tab === 'login' ? 'Login to AgroPestro' : 'Create Account'}
            </button>
          </form>

          {/* Lang toggle */}
          <div className="lang-row">
            <span>Language:</span>
            <button className="lang-btn active">தமிழ்</button>
            <button className="lang-btn">English</button>
          </div>
        </div>
      </div>
    </div>
  )
}
