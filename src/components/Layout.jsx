import { Link, useLocation } from 'react-router-dom'
import { Code2, Home, Terminal, Sparkles } from 'lucide-react'
import './Layout.css'

export default function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="layout">
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">
            <Code2 size={20} />
          </div>
          <span className="logo-text">
            Code<span className="logo-highlight">Playground</span>
          </span>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Home size={16} />
            <span>Inicio</span>
          </Link>
          <Link
            to="/playground"
            className={`nav-link ${location.pathname === '/playground' ? 'active' : ''}`}
          >
            <Terminal size={16} />
            <span>Playground</span>
          </Link>
        </div>

        <div className="nav-xp">
          <Sparkles size={14} />
          <span>{getStoredXP()} XP</span>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>
          <Code2 size={14} style={{ verticalAlign: 'middle' }} />{' '}
          CodePlayground — Aprende programando con diversión 🚀
        </p>
      </footer>
    </div>
  )
}

function getStoredXP() {
  try {
    const completed = JSON.parse(localStorage.getItem('completedChallenges') || '{}')
    return Object.values(completed).reduce((sum, xp) => sum + (xp || 0), 0)
  } catch {
    return 0
  }
}

