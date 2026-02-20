import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { challenges, languageConfig, difficultyConfig } from '../data/challenges'
import ChallengeCard from '../components/ChallengeCard'
import {
  Terminal, Sparkles, Zap, Trophy,
  Rocket, Search
} from 'lucide-react'
import './Home.css'

export default function Home() {
  const [selectedLang, setSelectedLang] = useState('all')
  const [selectedDiff, setSelectedDiff] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [completed, setCompleted] = useState({})

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('completedChallenges') || '{}')
      setCompleted(stored)
    } catch {}
  }, [])

  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => {
      if (selectedLang !== 'all' && c.language !== selectedLang) return false
      if (selectedDiff !== 'all' && c.difficulty !== selectedDiff) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [selectedLang, selectedDiff, searchQuery])

  const totalXP = Object.values(completed).reduce((s, xp) => s + (xp || 0), 0)
  const completedCount = Object.keys(completed).length

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Playground Interactivo de Código</span>
          </div>
          <h1 className="hero-title">
            Aprende a programar
            <br />
            <span className="hero-gradient">resolviendo retos</span>
          </h1>
          <p className="hero-subtitle">
            Ejercicios interactivos con editor en vivo, tests automáticos
            y feedback instantáneo. JavaScript, Python, HTML/CSS y más.
          </p>
          <div className="hero-actions">
            <a href="#challenges" className="btn-primary">
              <Rocket size={16} />
              Empezar ahora
            </a>
            <Link to="/playground" className="btn-secondary">
              <Terminal size={16} />
              Playground libre
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">{challenges.length}</div>
              <div className="stat-label">Retos</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">{Object.keys(languageConfig).length}</div>
              <div className="stat-label">Lenguajes</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">{completedCount}</div>
              <div className="stat-label">Completados</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value stat-xp">
                <Zap size={14} /> {totalXP}
              </div>
              <div className="stat-label">XP Total</div>
            </div>
          </div>
        </div>

        {/* Floating code snippet */}
        <div className="hero-code-float">
          <div className="code-window">
            <div className="code-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <pre className="code-content">
              <code>
                <span className="code-keyword">function</span>{' '}
                <span className="code-fn">solve</span>
                <span className="code-paren">(</span>
                <span className="code-param">challenge</span>
                <span className="code-paren">)</span>{' '}
                <span className="code-brace">{'{'}</span>
                {'\n'}
                {'  '}
                <span className="code-keyword">return</span>{' '}
                <span className="code-string">'🎉 ¡Resuelto!'</span>
                {'\n'}
                <span className="code-brace">{'}'}</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="challenges-section" id="challenges">
        <div className="section-header">
          <h2 className="section-title">
            <Trophy size={22} />
            Retos de Programación
          </h2>
          <p className="section-subtitle">
            Elige un reto, escribe tu solución y ejecuta los tests
          </p>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar retos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button
              className={`filter-btn ${selectedLang === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedLang('all')}
            >
              Todos
            </button>
            {Object.entries(languageConfig).map(([key, lang]) => (
              <button
                key={key}
                className={`filter-btn ${selectedLang === key ? 'active' : ''}`}
                onClick={() => setSelectedLang(key)}
                style={{ '--filter-color': lang.color }}
              >
                {lang.icon} {lang.label}
              </button>
            ))}
          </div>

          <div className="filter-group">
            {Object.entries(difficultyConfig).map(([key, diff]) => (
              <button
                key={key}
                className={`filter-btn ${selectedDiff === key ? 'active' : ''}`}
                onClick={() => setSelectedDiff(selectedDiff === key ? 'all' : key)}
                style={{ '--filter-color': diff.color }}
              >
                {diff.icon} {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Grid */}
        <div className="challenges-grid">
          {filteredChallenges.map((challenge, index) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              index={index}
              completed={!!completed[challenge.id]}
            />
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="empty-state">
            <span className="empty-emoji">🔍</span>
            <p>No se encontraron retos con esos filtros</p>
            <button
              className="btn-secondary"
              onClick={() => {
                setSelectedLang('all')
                setSelectedDiff('all')
                setSearchQuery('')
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-card">
          <div className="cta-icon">🚀</div>
          <h3>¿Quieres experimentar libremente?</h3>
          <p>Abre el Playground y escribe código sin restricciones</p>
          <Link to="/playground" className="btn-primary">
            <Terminal size={16} />
            Abrir Playground
          </Link>
        </div>
      </section>
    </div>
  )
}

