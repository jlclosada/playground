import { Link } from 'react-router-dom'
import { difficultyConfig, languageConfig } from '../data/challenges'
import { Check, ChevronRight, Zap } from 'lucide-react'
import './ChallengeCard.css'

export default function ChallengeCard({ challenge, index, completed }) {
  const lang = languageConfig[challenge.language]
  const diff = difficultyConfig[challenge.difficulty]
  const isCompleted = completed

  return (
    <Link
      to={`/challenge/${challenge.id}`}
      className={`challenge-card ${isCompleted ? 'completed' : ''}`}
      style={{
        animationDelay: `${index * 0.05}s`,
        '--accent': lang.color,
      }}
    >
      <div className="card-header">
        <span className="card-emoji">{challenge.emoji}</span>
        <div className="card-badges">
          <span className="card-lang" style={{ color: lang.color }}>
            {lang.icon} {lang.label}
          </span>
          <span className="card-diff" style={{ color: diff.color }}>
            {diff.icon} {diff.label}
          </span>
        </div>
      </div>

      <h3 className="card-title">{challenge.title}</h3>
      <p className="card-desc">{challenge.description}</p>

      <div className="card-footer">
        <div className="card-xp">
          <Zap size={14} />
          <span>{challenge.xp} XP</span>
        </div>
        <div className="card-action">
          {isCompleted ? (
            <span className="card-completed">
              <Check size={14} /> Completado
            </span>
          ) : (
            <span className="card-start">
              Resolver <ChevronRight size={14} />
            </span>
          )}
        </div>
      </div>

      {isCompleted && <div className="card-completed-stripe" />}
    </Link>
  )
}

