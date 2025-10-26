// Judge0 API integration for code execution
const axios = require('axios');

class Judge0Client {
  constructor() {
    // Using Judge0 CE (Community Edition) - you can host your own or use a public instance
    // For production, host your own Judge0 CE instance
    this.baseURL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
    this.apiKey = process.env.JUDGE0_API_KEY || 'your-rapidapi-key';
    this.host = process.env.JUDGE0_HOST || 'judge0-ce.p.rapidapi.com';

    // Language IDs for Judge0
    this.languageIds = {
      javascript: 63, // Node.js
      python: 71,    // Python 3
      java: 62,      // Java
      cpp: 54,       // C++
      c: 50,         // C
      csharp: 51,    // C#
      php: 68,       // PHP
      ruby: 72,      // Ruby
      go: 60,        // Go
      rust: 73       // Rust
    };
  }

  async executeCode(code, language, input = '', expectedOutput = '') {
    try {
      const languageId = this.languageIds[language.toLowerCase()];
      if (!languageId) {
        throw new Error(`Unsupported language: ${language}`);
      }

      // Submit code for execution
      const submitResponse = await axios.post(`${this.baseURL}/submissions`, {
        source_code: code,
        language_id: languageId,
        stdin: input,
        expected_output: expectedOutput,
        cpu_time_limit: 2, // 2 seconds
        memory_limit: 128000, // 128MB
        stack_limit: 64000, // 64MB
      }, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.host,
          'Content-Type': 'application/json'
        }
      });

      const token = submitResponse.data.token;

      // Wait for execution to complete
      let result;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

        const statusResponse = await axios.get(`${this.baseURL}/submissions/${token}`, {
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': this.host
          }
        });

        result = statusResponse.data;

        if (result.status.id !== 1 && result.status.id !== 2) { // Not queued or processing
          break;
        }

        attempts++;
      }

      return this.formatResult(result);
    } catch (error) {
      console.error('Judge0 execution error:', error);
      return {
        status: 'error',
        error: error.message,
        executionTime: 0,
        memoryUsed: 0
      };
    }
  }

  formatResult(result) {
    const statusMap = {
      3: 'accepted',
      4: 'wrong_answer',
      5: 'time_limit_exceeded',
      6: 'compilation_error',
      7: 'runtime_error',
      8: 'memory_limit_exceeded',
      9: 'output_limit_exceeded'
    };

    return {
      status: statusMap[result.status.id] || 'unknown_error',
      executionTime: parseFloat(result.time || 0),
      memoryUsed: parseInt(result.memory || 0),
      output: result.stdout || '',
      error: result.stderr || result.compile_output || '',
      description: result.status.description || 'Unknown status'
    };
  }

  async runTestCases(code, language, testCases) {
    const results = [];
    let totalTime = 0;
    let maxMemory = 0;
    let passedTests = 0;

    for (const testCase of testCases) {
      try {
        // Format input for Judge0
        const input = Array.isArray(testCase.input)
          ? testCase.input.map(arg => JSON.stringify(arg)).join('\n')
          : testCase.input.toString();

        const expectedOutput = JSON.stringify(testCase.expectedOutput);

        const result = await this.executeCode(code, language, input, expectedOutput);

        totalTime += result.executionTime;
        maxMemory = Math.max(maxMemory, result.memoryUsed);

        // Check if test passed
        const passed = result.status === 'accepted';

        if (passed) {
          passedTests++;
        }

        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: result.output,
          passed,
          executionTime: result.executionTime,
          memoryUsed: result.memoryUsed,
          error: result.error
        });

      } catch (error) {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          passed: false,
          executionTime: 0,
          memoryUsed: 0,
          error: error.message
        });
      }
    }

    const score = Math.round((passedTests / testCases.length) * 100);

    return {
      results,
      summary: {
        totalTests: testCases.length,
        passedTests,
        failedTests: testCases.length - passedTests,
        score,
        totalTime: Math.round(totalTime * 1000), // Convert to milliseconds
        maxMemory,
        status: passedTests === testCases.length ? 'accepted' : 'wrong_answer'
      }
    };
  }
}

module.exports = new Judge0Client();
