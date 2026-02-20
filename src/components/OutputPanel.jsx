import { Terminal, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import './OutputPanel.css'

export default function OutputPanel({ output, isRunning, testResults }) {
  return (
    <div className="output-panel">
      <div className="output-header">
        <Terminal size={14} />
        <span>Consola</span>
        {isRunning && <Loader2 size={14} className="spinning" />}
      </div>

      <div className="output-content">
        {output ? (
          <pre className="output-text">{output}</pre>
        ) : (
          <div className="output-empty">
            <span className="output-empty-icon">▶</span>
            <p>Ejecuta tu código para ver la salida</p>
          </div>
        )}
      </div>

      {testResults && testResults.length > 0 && (
        <div className="test-results">
          <div className="test-results-header">
            <span>📋 Resultados de Tests</span>
            <span className="test-score">
              {testResults.filter(t => t.passed).length}/{testResults.length}
            </span>
          </div>
          {testResults.map((test, i) => (
            <div
              key={i}
              className={`test-result ${test.passed ? 'passed' : 'failed'}`}
            >
              {test.passed ? (
                <CheckCircle size={14} className="test-icon pass" />
              ) : (
                <XCircle size={14} className="test-icon fail" />
              )}
              <div className="test-info">
                <code className="test-input">{test.input}</code>
                <span className="test-expected">
                  Esperado: <code>{test.expected}</code>
                  {!test.passed && test.actual && (
                    <> → Obtenido: <code className="test-actual">{test.actual}</code></>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

