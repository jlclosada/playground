// Safe code executor using eval with console capture
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

