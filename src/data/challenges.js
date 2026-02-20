export const challenges = [
  // ===== JAVASCRIPT =====
  {
    id: 'js-reverse-string',
    title: 'Invertir String',
    description: 'Escribe una función que invierta un string. Por ejemplo, "hola" → "aloh".',
    language: 'javascript',
    difficulty: 'easy',
    category: 'Strings',
    emoji: '🔄',
    starterCode: `// Invierte el string dado
function reverseString(str) {
  // Tu código aquí
  
}

// No modifiques las pruebas
console.log(reverseString("hello"));
console.log(reverseString("world"));
console.log(reverseString(""));`,
    tests: [
      { input: 'reverseString("hello")', expected: '"olleh"' },
      { input: 'reverseString("world")', expected: '"dlrow"' },
      { input: 'reverseString("")', expected: '""' },
      { input: 'reverseString("a")', expected: '"a"' },
    ],
    solution: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
    hint: '💡 Intenta usar split(), reverse() y join()',
    xp: 10,
  },
  {
    id: 'js-palindrome',
    title: 'Detector de Palíndromos',
    description: 'Crea una función que detecte si una palabra es un palíndromo (se lee igual de izquierda a derecha que de derecha a izquierda).',
    language: 'javascript',
    difficulty: 'easy',
    category: 'Strings',
    emoji: '🪞',
    starterCode: `// ¿Es un palíndromo?
function isPalindrome(str) {
  // Tu código aquí
  
}

console.log(isPalindrome("racecar"));
console.log(isPalindrome("hello"));
console.log(isPalindrome("aba"));`,
    tests: [
      { input: 'isPalindrome("racecar")', expected: 'true' },
      { input: 'isPalindrome("hello")', expected: 'false' },
      { input: 'isPalindrome("aba")', expected: 'true' },
      { input: 'isPalindrome("a")', expected: 'true' },
    ],
    solution: `function isPalindrome(str) {
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}`,
    hint: '💡 Invierte el string y compáralo con el original',
    xp: 10,
  },
  {
    id: 'js-fizzbuzz',
    title: 'FizzBuzz Clásico',
    description: 'Implementa FizzBuzz: devuelve un array del 1 al n donde los múltiplos de 3 son "Fizz", de 5 son "Buzz", de ambos "FizzBuzz", y el resto son números.',
    language: 'javascript',
    difficulty: 'easy',
    category: 'Lógica',
    emoji: '🎯',
    starterCode: `// FizzBuzz clásico
function fizzBuzz(n) {
  // Devuelve un array del 1 al n
  // Múltiplos de 3 → "Fizz"
  // Múltiplos de 5 → "Buzz"
  // Múltiplos de ambos → "FizzBuzz"
  // Resto → el número
  
}

console.log(fizzBuzz(15));`,
    tests: [
      { input: 'fizzBuzz(1)', expected: '[1]' },
      { input: 'fizzBuzz(3)[2]', expected: '"Fizz"' },
      { input: 'fizzBuzz(5)[4]', expected: '"Buzz"' },
      { input: 'fizzBuzz(15)[14]', expected: '"FizzBuzz"' },
    ],
    solution: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(i);
  }
  return result;
}`,
    hint: '💡 Usa el operador módulo (%) para verificar divisibilidad',
    xp: 15,
  },
  {
    id: 'js-max-number',
    title: 'Número Máximo',
    description: 'Encuentra el número más grande en un array sin usar Math.max ni sort.',
    language: 'javascript',
    difficulty: 'easy',
    category: 'Arrays',
    emoji: '📊',
    starterCode: `// Encuentra el número más grande
function findMax(arr) {
  // No uses Math.max ni sort!
  
}

console.log(findMax([1, 5, 3, 9, 2]));
console.log(findMax([-1, -5, -3]));
console.log(findMax([42]));`,
    tests: [
      { input: 'findMax([1, 5, 3, 9, 2])', expected: '9' },
      { input: 'findMax([-1, -5, -3])', expected: '-1' },
      { input: 'findMax([42])', expected: '42' },
      { input: 'findMax([0, 0, 0])', expected: '0' },
    ],
    solution: `function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}`,
    hint: '💡 Usa un bucle for y una variable para guardar el máximo',
    xp: 10,
  },
  {
    id: 'js-count-vowels',
    title: 'Contador de Vocales',
    description: 'Cuenta las vocales (a, e, i, o, u) en un string. No distingue mayúsculas/minúsculas.',
    language: 'javascript',
    difficulty: 'easy',
    category: 'Strings',
    emoji: '🔤',
    starterCode: `// Cuenta las vocales
function countVowels(str) {
  // Tu código aquí
  
}

console.log(countVowels("Hello World"));
console.log(countVowels("aeiou"));
console.log(countVowels("xyz"));`,
    tests: [
      { input: 'countVowels("Hello World")', expected: '3' },
      { input: 'countVowels("aeiou")', expected: '5' },
      { input: 'countVowels("xyz")', expected: '0' },
      { input: 'countVowels("AEIOU")', expected: '5' },
    ],
    solution: `function countVowels(str) {
  const vowels = 'aeiouAEIOU';
  let count = 0;
  for (const char of str) {
    if (vowels.includes(char)) count++;
  }
  return count;
}`,
    hint: '💡 Convierte a minúsculas y verifica si cada carácter está en "aeiou"',
    xp: 10,
  },
  {
    id: 'js-flatten-array',
    title: 'Aplanar Array',
    description: 'Aplana un array anidado de un nivel. Por ejemplo, [[1,2],[3,[4]]] → [1,2,3,[4]].',
    language: 'javascript',
    difficulty: 'medium',
    category: 'Arrays',
    emoji: '📏',
    starterCode: `// Aplana un nivel del array
function flatten(arr) {
  // Tu código aquí
  
}

console.log(flatten([[1, 2], [3, 4], [5]]));
console.log(flatten([[1], 2, [3, [4]]]));
console.log(flatten([]));`,
    tests: [
      { input: 'JSON.stringify(flatten([[1, 2], [3, 4], [5]]))', expected: '"[1,2,3,4,5]"' },
      { input: 'flatten([[1], 2, [3, [4]]]).length', expected: '4' },
      { input: 'JSON.stringify(flatten([]))', expected: '"[]"' },
    ],
    solution: `function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...item);
    } else {
      result.push(item);
    }
  }
  return result;
}`,
    hint: '💡 Usa Array.isArray() y el spread operator',
    xp: 20,
  },
  {
    id: 'js-fibonacci',
    title: 'Fibonacci',
    description: 'Genera los primeros n números de la secuencia de Fibonacci.',
    language: 'javascript',
    difficulty: 'medium',
    category: 'Matemáticas',
    emoji: '🌀',
    starterCode: `// Genera los primeros n números de Fibonacci
function fibonacci(n) {
  // Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13...
  
}

console.log(fibonacci(8));
console.log(fibonacci(1));
console.log(fibonacci(2));`,
    tests: [
      { input: 'JSON.stringify(fibonacci(8))', expected: '"[0,1,1,2,3,5,8,13]"' },
      { input: 'JSON.stringify(fibonacci(1))', expected: '"[0]"' },
      { input: 'JSON.stringify(fibonacci(2))', expected: '"[0,1]"' },
    ],
    solution: `function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i-1] + fib[i-2]);
  }
  return fib;
}`,
    hint: '💡 Cada número es la suma de los dos anteriores',
    xp: 20,
  },
  {
    id: 'js-anagram',
    title: 'Detector de Anagramas',
    description: 'Determina si dos strings son anagramas (contienen las mismas letras en diferente orden).',
    language: 'javascript',
    difficulty: 'medium',
    category: 'Strings',
    emoji: '🔀',
    starterCode: `// ¿Son anagramas?
function isAnagram(str1, str2) {
  // Tu código aquí
  
}

console.log(isAnagram("listen", "silent"));
console.log(isAnagram("hello", "world"));
console.log(isAnagram("Astronomer", "Moon starer"));`,
    tests: [
      { input: 'isAnagram("listen", "silent")', expected: 'true' },
      { input: 'isAnagram("hello", "world")', expected: 'false' },
      { input: 'isAnagram("abc", "cba")', expected: 'true' },
    ],
    solution: `function isAnagram(str1, str2) {
  const clean = s => s.toLowerCase().replace(/\\s/g, '').split('').sort().join('');
  return clean(str1) === clean(str2);
}`,
    hint: '💡 Ordena las letras de ambos strings y compáralos',
    xp: 20,
  },
  {
    id: 'js-deep-clone',
    title: 'Clonar Objeto',
    description: 'Implementa una función que haga una copia profunda de un objeto (sin usar JSON.parse/stringify).',
    language: 'javascript',
    difficulty: 'hard',
    category: 'Objetos',
    emoji: '🧬',
    starterCode: `// Clona un objeto profundamente
function deepClone(obj) {
  // No uses JSON.parse/JSON.stringify!
  
}

const original = { a: 1, b: { c: 2, d: [3, 4] } };
const cloned = deepClone(original);
cloned.b.c = 99;
console.log(original.b.c); // Debe ser 2
console.log(cloned.b.c);   // Debe ser 99`,
    tests: [
      { input: '(() => { const o = {a:1,b:{c:2}}; const c = deepClone(o); c.b.c = 99; return o.b.c; })()', expected: '2' },
      { input: '(() => { const o = {x:[1,2]}; const c = deepClone(o); c.x.push(3); return o.x.length; })()', expected: '2' },
    ],
    solution: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}`,
    hint: '💡 Usa recursión para manejar objetos anidados y arrays',
    xp: 30,
  },
  {
    id: 'js-debounce',
    title: 'Implementar Debounce',
    description: 'Implementa una función debounce que retrase la ejecución de una función hasta que pasen N milisegundos sin ser llamada.',
    language: 'javascript',
    difficulty: 'hard',
    category: 'Funciones',
    emoji: '⏱️',
    starterCode: `// Implementa debounce
function debounce(fn, delay) {
  // Tu código aquí
  
}

// Test
let count = 0;
const increment = debounce(() => { count++; }, 100);
increment();
increment();
increment();
// Después de 100ms, count debería ser 1
setTimeout(() => console.log("Count:", count), 200);`,
    tests: [
      { input: '(() => { let c = 0; const fn = debounce(() => c++, 50); fn(); fn(); fn(); return new Promise(r => setTimeout(() => r(c), 100)); })()', expected: '1' },
    ],
    solution: `function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}`,
    hint: '💡 Usa setTimeout y clearTimeout para controlar la ejecución',
    xp: 35,
  },

  // ===== PYTHON =====
  {
    id: 'py-reverse-list',
    title: 'Invertir Lista',
    description: 'Invierte una lista sin usar reverse() ni slicing [::-1].',
    language: 'python',
    difficulty: 'easy',
    category: 'Listas',
    emoji: '🐍',
    starterCode: `# Invierte la lista sin usar reverse() ni [::-1]
def reverse_list(lst):
    # Tu código aquí
    pass

print(reverse_list([1, 2, 3, 4, 5]))
print(reverse_list(['a', 'b', 'c']))
print(reverse_list([]))`,
    tests: [
      { input: 'reverse_list([1, 2, 3, 4, 5])', expected: '[5, 4, 3, 2, 1]' },
      { input: "reverse_list(['a', 'b', 'c'])", expected: "['c', 'b', 'a']" },
      { input: 'reverse_list([])', expected: '[]' },
    ],
    solution: `def reverse_list(lst):
    result = []
    for i in range(len(lst) - 1, -1, -1):
        result.append(lst[i])
    return result`,
    hint: '💡 Usa un bucle que vaya desde el final hasta el inicio',
    xp: 10,
  },
  {
    id: 'py-word-frequency',
    title: 'Frecuencia de Palabras',
    description: 'Cuenta cuántas veces aparece cada palabra en un string.',
    language: 'python',
    difficulty: 'medium',
    category: 'Diccionarios',
    emoji: '📚',
    starterCode: `# Cuenta la frecuencia de cada palabra
def word_frequency(text):
    # Devuelve un diccionario con las frecuencias
    pass

print(word_frequency("hola mundo hola"))
print(word_frequency("a b a b a"))`,
    tests: [
      { input: 'word_frequency("hola mundo hola")["hola"]', expected: '2' },
      { input: 'word_frequency("a b a b a")["a"]', expected: '3' },
      { input: 'len(word_frequency("x y z"))', expected: '3' },
    ],
    solution: `def word_frequency(text):
    freq = {}
    for word in text.split():
        freq[word] = freq.get(word, 0) + 1
    return freq`,
    hint: '💡 Usa split() para separar las palabras y un diccionario para contar',
    xp: 20,
  },
  {
    id: 'py-matrix-transpose',
    title: 'Transponer Matriz',
    description: 'Transpone una matriz (intercambia filas por columnas).',
    language: 'python',
    difficulty: 'medium',
    category: 'Matrices',
    emoji: '🔲',
    starterCode: `# Transpone la matriz
def transpose(matrix):
    # Tu código aquí
    pass

print(transpose([[1, 2, 3], [4, 5, 6]]))
print(transpose([[1], [2], [3]]))`,
    tests: [
      { input: 'transpose([[1, 2, 3], [4, 5, 6]])', expected: '[[1, 4], [2, 5], [3, 6]]' },
      { input: 'transpose([[1], [2], [3]])', expected: '[[1, 2, 3]]' },
    ],
    solution: `def transpose(matrix):
    return [[row[i] for row in matrix] for i in range(len(matrix[0]))]`,
    hint: '💡 Usa list comprehension con doble iteración',
    xp: 25,
  },

  // ===== HTML/CSS =====
  {
    id: 'html-card',
    title: 'Tarjeta de Perfil',
    description: 'Crea una tarjeta de perfil elegante con HTML y CSS. Debe tener un avatar, nombre, descripción y botón.',
    language: 'html',
    difficulty: 'easy',
    category: 'Diseño',
    emoji: '🎨',
    starterCode: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #0a0a0f;
    font-family: sans-serif;
    margin: 0;
  }
  
  /* Tu CSS aquí */
  .card {
    
  }
</style>
</head>
<body>
  <!-- Tu HTML aquí -->
  <div class="card">
    <h2>Tu Nombre</h2>
    <p>Desarrollador Web</p>
    <button>Contactar</button>
  </div>
</body>
</html>`,
    tests: [],
    solution: `<!-- Esta es una solución visual, no hay tests automáticos -->`,
    hint: '💡 Usa border-radius, box-shadow y gradients para hacerla elegante',
    xp: 15,
  },
  {
    id: 'html-animation',
    title: 'Animación CSS',
    description: 'Crea una animación con CSS puro. Haz que un elemento se mueva, rote o cambie de color.',
    language: 'html',
    difficulty: 'medium',
    category: 'Animaciones',
    emoji: '✨',
    starterCode: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #0a0a0f;
    margin: 0;
  }
  
  @keyframes myAnimation {
    /* Define tu animación */
  }
  
  .animated {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    border-radius: 16px;
    /* Aplica tu animación */
  }
</style>
</head>
<body>
  <div class="animated"></div>
</body>
</html>`,
    tests: [],
    solution: `<!-- Esta es una solución visual, no hay tests automáticos -->`,
    hint: '💡 Usa @keyframes con transform: rotate() y scale()',
    xp: 20,
  },

  // ===== TYPESCRIPT =====
  {
    id: 'ts-generic-stack',
    title: 'Stack Genérico',
    description: 'Implementa una estructura de datos Stack (pila) usando genéricos de TypeScript.',
    language: 'typescript',
    difficulty: 'hard',
    category: 'Estructuras de Datos',
    emoji: '📚',
    starterCode: `// Implementa un Stack genérico
class Stack<T> {
  // Tu código aquí
  
  push(item: T): void {
    // Añade un elemento
  }
  
  pop(): T | undefined {
    // Remueve y devuelve el último elemento
    return undefined;
  }
  
  peek(): T | undefined {
    // Devuelve el último elemento sin removerlo
    return undefined;
  }
  
  get size(): number {
    // Devuelve el tamaño
    return 0;
  }
  
  isEmpty(): boolean {
    // ¿Está vacío?
    return true;
  }
}

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.peek());  // 3
console.log(stack.pop());   // 3
console.log(stack.size);    // 2`,
    tests: [
      { input: '(() => { const s = new Stack(); s.push(1); s.push(2); return s.peek(); })()', expected: '2' },
      { input: '(() => { const s = new Stack(); s.push(1); s.push(2); s.pop(); return s.size; })()', expected: '1' },
      { input: '(() => { const s = new Stack(); return s.isEmpty(); })()', expected: 'true' },
    ],
    solution: `class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  get size(): number { return this.items.length; }
  isEmpty(): boolean { return this.items.length === 0; }
}`,
    hint: '💡 Usa un array interno para almacenar los elementos',
    xp: 30,
  },
]

export const languageConfig = {
  javascript: {
    label: 'JavaScript',
    icon: '🟨',
    color: '#f59e0b',
    monacoLang: 'javascript',
  },
  python: {
    label: 'Python',
    icon: '🐍',
    color: '#3b82f6',
    monacoLang: 'python',
  },
  html: {
    label: 'HTML/CSS',
    icon: '🌐',
    color: '#ef4444',
    monacoLang: 'html',
  },
  typescript: {
    label: 'TypeScript',
    icon: '🔷',
    color: '#3178c6',
    monacoLang: 'typescript',
  },
}

export const difficultyConfig = {
  easy: { label: 'Fácil', color: '#10b981', icon: '🟢' },
  medium: { label: 'Medio', color: '#f59e0b', icon: '🟡' },
  hard: { label: 'Difícil', color: '#ef4444', icon: '🔴' },
}

