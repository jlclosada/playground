import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { challenges, languageConfig, difficultyConfig } from '../data/challenges'
import CodeEditor from '../components/CodeEditor'
import OutputPanel from '../components/OutputPanel'
import { executeJavaScript, runTests, executePython, runPythonTests, loadPyodide, isPyodideReady } from '../utils/codeRunner'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'
import {
  Play, RotateCcw, ChevronLeft, ChevronRight, Eye, EyeOff,
  Lightbulb, CheckCircle, Zap, Copy, BookOpen, ArrowLeft
} from 'lucide-react'
import './ChallengeView.css'

export default function ChallengeView() {
  const { id } = useParams()
  const challenge = challenges.find(c => c.id === id)
  const challengeIndex = challenges.findIndex(c => c.id === id)

  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [pyodideStatus, setPyodideStatus] = useState('idle') // idle | loading | ready

  // Pre-load Pyodide when entering a Python challenge
  useEffect(() => {
    if (challenge && challenge.language === 'python' && !isPyodideReady()) {
      setPyodideStatus('loading')
      loadPyodide().then(() => setPyodideStatus('ready')).catch(() => setPyodideStatus('idle'))
    } else if (isPyodideReady()) {
      setPyodideStatus('ready')
    }
  }, [challenge?.id])

  useEffect(() => {
    if (challenge) {
      // Try to load saved code
      const saved = localStorage.getItem(`code_${challenge.id}`)
      setCode(saved || challenge.starterCode)
      setOutput('')
      setTestResults(null)
      setShowHint(false)
      setShowSolution(false)

      const completed = JSON.parse(localStorage.getItem('completedChallenges') || '{}')
      setIsCompleted(!!completed[challenge.id])
    }
  }, [challenge?.id])

  const handleRun = useCallback(async () => {
    if (!challenge) return
    setIsRunning(true)
    setOutput('')
    setTestResults(null)

    // Save code
    localStorage.setItem(`code_${challenge.id}`, code)

    try {
      if (challenge.language === 'javascript' || challenge.language === 'typescript') {
        const result = executeJavaScript(code)
        let outputStr = result.output || ''
        if (result.error) {
          outputStr += (outputStr ? '\n' : '') + result.error
        }
        setOutput(outputStr)

        // Run tests
        if (challenge.tests && challenge.tests.length > 0) {
          const results = runTests(code, challenge.tests)
          setTestResults(results)

          const allPassed = results.every(t => t.passed)
          if (allPassed) {
            handleChallengeCompleted()
          }
        }
      } else if (challenge.language === 'python') {
        // Real Python execution with Pyodide
        setOutput('🐍 Cargando Python...')

        const result = await executePython(code)
        let outputStr = result.output || ''
        if (result.error) {
          outputStr += (outputStr ? '\n' : '') + result.error
        }
        setOutput(outputStr)

        // Run Python tests
        if (challenge.tests && challenge.tests.length > 0) {
          const results = await runPythonTests(code, challenge.tests)
          setTestResults(results)

          const allPassed = results.every(t => t.passed)
          if (allPassed) {
            handleChallengeCompleted()
          }
        }
      } else if (challenge.language === 'html') {
        setOutput('✨ Mira la previsualización a la derecha para ver tu resultado')
        setTestResults(null)
      }
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`)
    }

    setIsRunning(false)
  }, [code, challenge])

  const handleChallengeCompleted = () => {
    if (isCompleted) return

    setIsCompleted(true)
    const completed = JSON.parse(localStorage.getItem('completedChallenges') || '{}')
    completed[challenge.id] = challenge.xp
    localStorage.setItem('completedChallenges', JSON.stringify(completed))

    // Confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'],
    })

    toast.success(`🎉 ¡Reto completado! +${challenge.xp} XP`, {
      duration: 4000,
    })
  }

  const handleReset = () => {
    setCode(challenge.starterCode)
    setOutput('')
    setTestResults(null)
    localStorage.removeItem(`code_${challenge.id}`)
    toast('🔄 Código reiniciado')
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    toast.success('📋 Código copiado')
  }

  const handleShowSolution = () => {
    setShowSolution(!showSolution)
    if (!showSolution) {
      setCode(challenge.solution)
    } else {
      const saved = localStorage.getItem(`code_${challenge.id}`)
      setCode(saved || challenge.starterCode)
    }
  }

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleRun()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRun])

  if (!challenge) {
    return (
      <div className="not-found">
        <h2>Reto no encontrado 😢</h2>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
      </div>
    )
  }

  const lang = languageConfig[challenge.language]
  const diff = difficultyConfig[challenge.difficulty]
  const prevChallenge = challengeIndex > 0 ? challenges[challengeIndex - 1] : null
  const nextChallenge = challengeIndex < challenges.length - 1 ? challenges[challengeIndex + 1] : null

  return (
    <div className="challenge-view">
      {/* Floating Run Button — always visible */}
      <button className="floating-run-btn" onClick={handleRun} disabled={isRunning}>
        <Play size={18} />
        {isRunning
          ? (challenge.language === 'python' ? '🐍 Ejecutando...' : 'Ejecutando...')
          : '▶ Ejecutar'}
        <kbd>⌘↵</kbd>
      </button>

      {/* Python loading indicator */}
      {challenge.language === 'python' && pyodideStatus === 'loading' && (
        <div className="pyodide-loading-bar">
          🐍 Cargando motor de Python (solo la primera vez)...
        </div>
      )}

      {/* Top Bar */}
      <div className="challenge-topbar">
        <div className="topbar-left">
          <Link to="/" className="back-btn">
            <ArrowLeft size={16} />
          </Link>
          <div className="challenge-info">
            <div className="challenge-meta">
              <span className="meta-lang" style={{ color: lang.color }}>
                {lang.icon} {lang.label}
              </span>
              <span className="meta-diff" style={{ color: diff.color }}>
                {diff.icon} {diff.label}
              </span>
              <span className="meta-cat">{challenge.category}</span>
              {isCompleted && (
                <span className="meta-completed">
                  <CheckCircle size={12} /> Completado
                </span>
              )}
            </div>
            <h2 className="challenge-name">
              {challenge.emoji} {challenge.title}
            </h2>
          </div>
        </div>

        <div className="topbar-actions">
          <button className="action-btn hint-btn" onClick={() => setShowHint(!showHint)} title="Pista">
            <Lightbulb size={15} />
          </button>
          <button className="action-btn" onClick={handleShowSolution} title={showSolution ? 'Ocultar solución' : 'Ver solución'}>
            {showSolution ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
          <button className="action-btn" onClick={handleCopyCode} title="Copiar código">
            <Copy size={15} />
          </button>
          <button className="action-btn" onClick={handleReset} title="Reiniciar">
            <RotateCcw size={15} />
          </button>
          <button className="run-btn" onClick={handleRun} disabled={isRunning}>
            <Play size={15} />
            {isRunning ? 'Ejecutando...' : 'Ejecutar'}
            <kbd>⌘↵</kbd>
          </button>
        </div>
      </div>

      {/* Hint */}
      {showHint && (
        <div className="hint-bar">
          <Lightbulb size={14} />
          {challenge.hint}
        </div>
      )}

      {/* Description */}
      <div className="challenge-description">
        <BookOpen size={14} />
        <p>{challenge.description}</p>
        <span className="xp-badge"><Zap size={12} /> {challenge.xp} XP</span>
      </div>

      {/* Editor + Output */}
      <div className="editor-layout">
        <div className="editor-pane">
          <CodeEditor
            language={lang.monacoLang}
            code={code}
            onChange={(val) => setCode(val || '')}
          />
        </div>
        <div className="output-pane">
          <OutputPanel
            output={output}
            isRunning={isRunning}
            testResults={testResults}
          />

          {/* HTML Preview */}
          {challenge.language === 'html' && (
            <div className="html-preview">
              <div className="preview-header">
                <Eye size={14} />
                <span>Previsualización</span>
              </div>
              <iframe
                title="preview"
                className="preview-frame"
                srcDoc={code}
                sandbox="allow-scripts"
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="challenge-nav">
        {prevChallenge ? (
          <Link to={`/challenge/${prevChallenge.id}`} className="nav-prev">
            <ChevronLeft size={16} />
            <span>{prevChallenge.emoji} {prevChallenge.title}</span>
          </Link>
        ) : <div />}
        {nextChallenge ? (
          <Link to={`/challenge/${nextChallenge.id}`} className="nav-next">
            <span>{nextChallenge.emoji} {nextChallenge.title}</span>
            <ChevronRight size={16} />
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}

