import { useState, useEffect, useCallback } from 'react'
import CodeEditor from '../components/CodeEditor'
import OutputPanel from '../components/OutputPanel'
import { executeJavaScript, executePython, loadPyodide, isPyodideReady } from '../utils/codeRunner'
import {
  Play, Copy, Download, Trash2, Save,
  FileCode, Eye
} from 'lucide-react'
import toast from 'react-hot-toast'
import './FreePlayground.css'

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', icon: '🟨', monacoLang: 'javascript' },
  { id: 'typescript', label: 'TypeScript', icon: '🔷', monacoLang: 'typescript' },
  { id: 'html', label: 'HTML', icon: '🌐', monacoLang: 'html' },
  { id: 'css', label: 'CSS', icon: '🎨', monacoLang: 'css' },
  { id: 'python', label: 'Python', icon: '🐍', monacoLang: 'python' },
  { id: 'json', label: 'JSON', icon: '📦', monacoLang: 'json' },
]

const TEMPLATES = {
  javascript: `// 🚀 JavaScript Playground
// Escribe tu código aquí y presiona Ejecutar (⌘+Enter)

function greet(name) {
  return \`¡Hola, \${name}! 👋\`;
}

console.log(greet("Mundo"));

// Prueba arrays
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Dobles:", doubled);

// Prueba objetos
const user = {
  name: "Dev",
  skills: ["JS", "React", "Node"],
  level: "Awesome 🔥"
};
console.log(user);`,

  typescript: `// 🔷 TypeScript Playground
interface User {
  name: string;
  age: number;
  skills: string[];
}

function greetUser(user: User): string {
  return \`Hola \${user.name}, tienes \${user.age} años y sabes \${user.skills.join(", ")}\`;
}

const dev: User = {
  name: "Dev",
  age: 25,
  skills: ["TypeScript", "React", "Node"]
};

console.log(greetUser(dev));`,

  html: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
    font-family: 'Segoe UI', sans-serif;
    color: white;
  }
  .card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    max-width: 400px;
  }
  .card h1 {
    font-size: 2rem;
    margin-bottom: 10px;
  }
  .card p {
    opacity: 0.7;
    margin-bottom: 20px;
  }
  .btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .btn:hover { transform: scale(1.05); }
</style>
</head>
<body>
  <div class="card">
    <h1>🚀 Mi Proyecto</h1>
    <p>Edita este HTML y mira los cambios en tiempo real</p>
    <button class="btn" onclick="alert('¡Funciona!')">Click me</button>
  </div>
</body>
</html>`,

  css: `/* 🎨 CSS Playground */
/* Escribe tu CSS aquí */

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #0a0a0f;
}

.box {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 16px;
  animation: spin 3s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}`,

  python: `# 🐍 Python Playground
# ¡Se ejecuta de verdad en tu navegador con Pyodide!

def fibonacci(n):
    """Genera los primeros n números de Fibonacci"""
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib[:n]

# Ejemplo
print("Fibonacci:", fibonacci(10))

# List comprehension
squares = [x**2 for x in range(1, 11)]
print("Cuadrados:", squares)

# Diccionario
person = {
    "name": "Dev",
    "age": 25,
    "skills": ["Python", "Django", "FastAPI"]
}
print("Persona:", person)`,

  json: `{
  "name": "CodePlayground",
  "version": "1.0.0",
  "description": "Un playground interactivo de código",
  "features": [
    "Editor en vivo",
    "Tests automáticos",
    "Múltiples lenguajes",
    "XP y logros"
  ],
  "author": {
    "name": "Dev",
    "role": "Desarrollador"
  }
}`,
}

export default function FreePlayground() {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(TEMPLATES.javascript)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [savedSnippets, setSavedSnippets] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('playground_snippets')
    if (saved) setSavedSnippets(JSON.parse(saved))
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem(`playground_${language}`)
    if (saved) {
      setCode(saved)
    } else {
      setCode(TEMPLATES[language] || '')
    }
    setOutput('')
  }, [language])

  const handleRun = useCallback(async () => {
    setIsRunning(true)
    localStorage.setItem(`playground_${language}`, code)

    try {
      if (language === 'javascript' || language === 'typescript') {
        const result = executeJavaScript(code)
        let out = result.output || ''
        if (result.error) out += (out ? '\n' : '') + result.error
        setOutput(out || '✅ Código ejecutado sin output')
      } else if (language === 'python') {
        setOutput('🐍 Cargando Python...')
        const result = await executePython(code)
        let out = result.output || ''
        if (result.error) out += (out ? '\n' : '') + result.error
        setOutput(out || '✅ Código ejecutado sin output')
      } else if (language === 'json') {
        try {
          JSON.parse(code)
          setOutput('✅ JSON válido')
        } catch (e) {
          setOutput(`❌ JSON inválido: ${e.message}`)
        }
      } else {
        setOutput('💡 Usa la previsualización para ver el resultado visual.')
      }
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`)
    }

    setIsRunning(false)
  }, [code, language])

  const handleSave = () => {
    const name = prompt('Nombre del snippet:')
    if (!name) return
    const snippet = { name, language, code, date: new Date().toISOString() }
    const updated = [...savedSnippets, snippet]
    setSavedSnippets(updated)
    localStorage.setItem('playground_snippets', JSON.stringify(updated))
    toast.success(`💾 Snippet "${name}" guardado`)
  }

  const handleLoadSnippet = (snippet) => {
    setLanguage(snippet.language)
    setCode(snippet.code)
    toast.success(`📂 Snippet "${snippet.name}" cargado`)
  }

  const handleDeleteSnippet = (index) => {
    const updated = savedSnippets.filter((_, i) => i !== index)
    setSavedSnippets(updated)
    localStorage.setItem('playground_snippets', JSON.stringify(updated))
    toast('🗑️ Snippet eliminado')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    toast.success('📋 Código copiado')
  }

  const handleDownload = () => {
    const extensions = { javascript: 'js', typescript: 'ts', html: 'html', css: 'css', python: 'py', json: 'json' }
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `playground.${extensions[language] || 'txt'}`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('📥 Archivo descargado')
  }

  const handleClear = () => {
    setCode('')
    setOutput('')
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleRun()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        localStorage.setItem(`playground_${language}`, code)
        toast.success('💾 Guardado')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRun, code, language])

  const currentLang = LANGUAGES.find(l => l.id === language)
  const showPreview = language === 'html'

  return (
    <div className="free-playground">
      {/* Floating Run Button — always visible */}
      <button className="floating-run-btn" onClick={handleRun} disabled={isRunning}>
        <Play size={18} />
        {isRunning ? 'Ejecutando...' : 'Ejecutar'}
        <kbd>⌘↵</kbd>
      </button>

      {/* Toolbar */}
      <div className="pg-toolbar">
        <div className="pg-toolbar-left">
          <div className="lang-selector">
            {LANGUAGES.map(lang => (
              <button
                key={lang.id}
                className={`lang-btn ${language === lang.id ? 'active' : ''}`}
                onClick={() => setLanguage(lang.id)}
                title={lang.label}
              >
                <span className="lang-icon">{lang.icon}</span>
                <span className="lang-label">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pg-toolbar-right">
          <button className="pg-action" onClick={handleSave} title="Guardar snippet">
            <Save size={15} />
          </button>
          <button className="pg-action" onClick={handleCopy} title="Copiar">
            <Copy size={15} />
          </button>
          <button className="pg-action" onClick={handleDownload} title="Descargar">
            <Download size={15} />
          </button>
          <button className="pg-action danger" onClick={handleClear} title="Limpiar">
            <Trash2 size={15} />
          </button>
          <button className="pg-run-btn" onClick={handleRun} disabled={isRunning}>
            <Play size={15} />
            {isRunning ? 'Ejecutando...' : 'Ejecutar'}
            <kbd>⌘↵</kbd>
          </button>
        </div>
      </div>

      {/* Saved Snippets */}
      {savedSnippets.length > 0 && (
        <div className="snippets-bar">
          <FileCode size={13} />
          <span className="snippets-label">Snippets:</span>
          {savedSnippets.map((snippet, i) => (
            <div key={i} className="snippet-chip">
              <button className="snippet-name" onClick={() => handleLoadSnippet(snippet)}>
                {snippet.name}
              </button>
              <button className="snippet-delete" onClick={() => handleDeleteSnippet(i)}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Editor Area */}
      <div className="pg-editor-layout">
        <div className="pg-editor-pane">
          <CodeEditor
            language={currentLang.monacoLang}
            code={code}
            onChange={(val) => setCode(val || '')}
          />
        </div>

        <div className="pg-output-pane">
          {showPreview ? (
            <div className="pg-preview-split">
              <div className="pg-console-half">
                <OutputPanel output={output} isRunning={isRunning} testResults={null} />
              </div>
              <div className="pg-preview-half">
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
            </div>
          ) : (
            <OutputPanel output={output} isRunning={isRunning} testResults={null} />
          )}
        </div>
      </div>
    </div>
  )
}

