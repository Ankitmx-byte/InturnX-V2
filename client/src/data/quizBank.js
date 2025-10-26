// Lightweight predefined quiz bank organized by language and level.
// Extend by adding more levels and questions. Keep ~10 Qs per level ideally.

export const LANGUAGES = [
  { key: 'javascript', label: 'JavaScript' },
  { key: 'python', label: 'Python' },
  { key: 'cpp', label: 'C++' },
  { key: 'java', label: 'Java' },
];

// Each question: { id, question, options: string[], answerIndex, tags: string[], explanation: string, codeExample?: string }
export const QUIZ_BANK = {
  javascript: {
    1: [
      {
        id: 'js-1-1',
        question: 'What is the result of typeof null in JavaScript?',
        options: ['"object"', '"null"', '"undefined"', '"number"'],
        answerIndex: 0,
        tags: ['basics', 'types'],
        explanation: 'In JavaScript, typeof null returns "object" due to a historical bug in the language that remains for backward compatibility.',
        codeExample: 'console.log(typeof null); // "object"',
      },
      {
        id: 'js-1-2',
        question: 'Which method converts a JSON string into a JavaScript object?',
        options: ['JSON.parse', 'JSON.stringify', 'Object.fromJSON', 'JSON.toObject'],
        answerIndex: 0,
        tags: ['json', 'basics'],
        explanation: 'Use JSON.parse to parse a JSON string into an object. JSON.stringify does the inverse (object -> string).',
        codeExample: 'const obj = JSON.parse("{\\"a\\":1}");',
      },
      {
        id: 'js-1-3',
        question: 'What does the spread operator (...) do when used in an array literal?',
        options: ['It copies by reference', 'It creates a shallow copy/spreads elements', 'It deep-clones nested structures', 'It sorts the array'],
        answerIndex: 1,
        tags: ['arrays', 'syntax'],
        explanation: 'The spread operator spreads elements into a new array, creating a shallow copy (nested objects are still by reference).',
        codeExample: 'const a = [1,2]; const b = [...a, 3]; // b = [1,2,3]'
      },
    ],
    2: [
      {
        id: 'js-2-1',
        question: 'Which keyword declares a block-scoped variable?',
        options: ['var', 'let', 'function', 'with'],
        answerIndex: 1,
        tags: ['scope', 'basics'],
        explanation: 'let and const are block-scoped. var is function-scoped.',
        codeExample: 'if(true){ let x = 1; } // x not accessible here',
      },
    ],
  },
  python: {
    1: [
      {
        id: 'py-1-1',
        question: 'Which of the following creates a list in Python?',
        options: ['(1, 2, 3)', '{1, 2, 3}', '[1, 2, 3]', 'list:1,2,3'],
        answerIndex: 2,
        tags: ['lists', 'basics'],
        explanation: 'Square brackets [] denote a list. Parentheses () are tuples, curly braces {} are sets/dicts.',
        codeExample: 'items = [1, 2, 3]'
      },
      {
        id: 'py-1-2',
        question: 'What is the result of len({"a": 1, "b": 2})?',
        options: ['1', '2', '3', 'Error'],
        answerIndex: 1,
        tags: ['dict', 'basics'],
        explanation: 'len on a dict returns the number of keys. There are two keys: a and b.',
        codeExample: 'print(len({"a":1, "b":2})) # 2'
      }
    ],
  },
  cpp: {
    1: [
      {
        id: 'cpp-1-1',
        question: 'Which is the correct way to include the iostream library?',
        options: ['include <iostream>', '#include <iostream>', '#include iostream', 'use iostream;'],
        answerIndex: 1,
        tags: ['includes', 'basics'],
        explanation: 'C++ headers are included using the preprocessor directive: #include <iostream>.',
        codeExample: '#include <iostream>\nint main(){ std::cout << "Hi"; }'
      },
    ],
  },
  java: {
    1: [
      {
        id: 'java-1-1',
        question: 'Which keyword is used to inherit a class in Java?',
        options: ['this', 'implements', 'extends', 'inherits'],
        answerIndex: 2,
        tags: ['oop', 'inheritance'],
        explanation: 'Use extends for class inheritance. Use implements for interfaces.',
        codeExample: 'class Child extends Parent { }'
      },
    ],
  },
};

export const MAX_LEVEL = 100;

export function getLevelsForLanguage(lang) {
  const definedLevels = QUIZ_BANK[lang] ? Object.keys(QUIZ_BANK[lang]).map((n) => parseInt(n, 10)) : [];
  const maxDefined = definedLevels.length ? Math.max(...definedLevels) : 0;
  // We conceptually support up to MAX_LEVEL, but content may not yet exist for all levels.
  return { definedLevels, maxDefined };
}
