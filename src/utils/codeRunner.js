// Safe code executor using eval with console capture
// + Python execution via Pyodide (CPython compiled to WebAssembly)

// ========== PYODIDE LOADER ==========
let pyodideInstance = null
let pyodideLoading = false
let pyodideLoadPromise = null

export function isPyodideReady() {
  return pyodideInstance !== null
}

export async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance
  if (pyodideLoading) return pyodideLoadPromise

  pyodideLoading = true
  pyodideLoadPromise = (async () => {
    // Load the Pyodide script dynamically
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js'
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }
    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
    })
    pyodideLoading = false
    return pyodideInstance
  })()

  return pyodideLoadPromise
}

// ========== PYTHON EXECUTION ==========
export async function executePython(code) {
  try {
    const pyodide = await loadPyodide()

    // Capture stdout/stderr
    pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
    `)

    try {
      pyodide.runPython(code)
    } catch (err) {
      const stderr = pyodide.runPython('sys.stderr.getvalue()')
      return {
        output: '',
        error: `❌ ${err.message}${stderr ? '\n' + stderr : ''}`,
      }
    }

    const stdout = pyodide.runPython('sys.stdout.getvalue()')
    const stderr = pyodide.runPython('sys.stderr.getvalue()')

    // Reset stdout/stderr
    pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
    `)

    return {
      output: stdout || '✅ Código ejecutado sin output',
      error: stderr ? `⚠️ ${stderr}` : null,
    }
  } catch (err) {
    return {
      output: '',
      error: `❌ Error cargando Python: ${err.message}`,
    }
  }
}

export async function runPythonTests(code, tests) {
  if (!tests || tests.length === 0) return []

  try {
    const pyodide = await loadPyodide()

    const results = []
    for (const test of tests) {
      try {
        // Reset stdout/stderr for each test
        pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
        `)

        // Run user code first
        pyodide.runPython(code)

        // Evaluate the test expression and get repr + str
        const actual = pyodide.runPython(`
__test_result__ = ${test.input}
repr(__test_result__)
        `)
        const actualStr = pyodide.runPython(`str(__test_result__)`)

        // Reset
        pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
        `)

        const expected = test.expected

        // Compare with multiple strategies
        const normalizeSpaces = s => s.replace(/\s+/g, ' ').trim()
        const passed =
          actual === expected ||
          actualStr === expected ||
          normalizeSpaces(actual) === normalizeSpaces(expected) ||
          normalizeSpaces(actualStr) === normalizeSpaces(expected)

        results.push({
          input: test.input,
          expected,
          actual,
          passed,
        })
      } catch (err) {
        // Reset stdout on error too
        try {
          pyodide.runPython(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
          `)
        } catch {}

        results.push({
          input: test.input,
          expected: test.expected,
          actual: `Error: ${err.message}`,
          passed: false,
        })
      }
    }
    return results
  } catch (err) {
    return tests.map(test => ({
      input: test.input,
      expected: test.expected,
      actual: `Error: ${err.message}`,
      passed: false,
    }))
  }
}

// ========== JAVASCRIPT EXECUTION ==========
export function executeJavaScript(code) {
  const logs = []
  const originalConsole = { ...console }

  // Override console methods
  const fakeConsole = {
    log: (...args) => logs.push(args.map(formatValue).join(' ')),
    error: (...args) => logs.push('❌ ' + args.map(formatValue).join(' ')),
    warn: (...args) => logs.push('⚠️ ' + args.map(formatValue).join(' ')),
    info: (...args) => logs.push('ℹ️ ' + args.map(formatValue).join(' ')),
    table: (data) => logs.push(JSON.stringify(data, null, 2)),
    clear: () => logs.length = 0,
  }

  try {
    // Create a function with overridden console
    const wrappedCode = `
      (function() {
        const console = arguments[0];
        ${code}
      })
    `
    const fn = eval(wrappedCode)
    const result = fn(fakeConsole)

    if (result !== undefined && logs.length === 0) {
      logs.push(formatValue(result))
    }

    return { output: logs.join('\n'), error: null }
  } catch (err) {
    return {
      output: logs.join('\n'),
      error: `❌ ${err.name}: ${err.message}`,
    }
  }
}

export function runTests(code, tests) {
  if (!tests || tests.length === 0) return []

  return tests.map(test => {
    try {
      const wrappedCode = `
        (function() {
          const console = { log: () => {}, error: () => {}, warn: () => {}, info: () => {}, table: () => {}, clear: () => {} };
          ${code}
          return ${test.input};
        })()
      `
      const result = eval(wrappedCode)
      const actual = formatValue(result)
      const expected = test.expected

      return {
        input: test.input,
        expected,
        actual,
        passed: actual === expected || String(result) === expected,
      }
    } catch (err) {
      return {
        input: test.input,
        expected: test.expected,
        actual: `Error: ${err.message}`,
        passed: false,
      }
    }
  })
}

function formatValue(val) {
  if (val === undefined) return 'undefined'
  if (val === null) return 'null'
  if (typeof val === 'string') return `"${val}"`
  if (typeof val === 'function') return `[Function: ${val.name || 'anonymous'}]`
  if (Array.isArray(val)) return JSON.stringify(val)
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val, null, 2)
    } catch {
      return String(val)
    }
  }
  return String(val)
}
