// Open source coding problems database
// Problems sourced from LeetCode, HackerRank, and other platforms
// Each problem includes test cases for validation

const problems = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Array',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    testCases: [
      {
        input: [[2,7,11,15], 9],
        expectedOutput: [0,1]
      },
      {
        input: [[3,2,4], 6],
        expectedOutput: [1,2]
      },
      {
        input: [[3,3], 6],
        expectedOutput: [0,1]
      }
    ],
    languages: {
      javascript: {
        template: `function twoSum(nums, target) {
    // Your code here

}`,
        testRunner: `function runTests() {
    const testCases = [
        { input: [[2,7,11,15], 9], expected: [0,1] },
        { input: [[3,2,4], 6], expected: [1,2] },
        { input: [[3,3], 6], expected: [0,1] }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const result = twoSum(...testCases[i].input);
        if (JSON.stringify(result.sort()) !== JSON.stringify(testCases[i].expected.sort())) {
            throw new Error(\`Test case \${i + 1} failed. Expected: \${JSON.stringify(testCases[i].expected)}, Got: \${JSON.stringify(result)}\`);
        }
    }
    return "All tests passed!";
}`
      },
      python: {
        template: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your code here
    pass`,
        testRunner: `import json

def run_tests():
    test_cases = [
        {"input": [[2,7,11,15], 9], "expected": [0,1]},
        {"input": [[3,2,4], 6], "expected": [1,2]},
        {"input": [[3,3], 6], "expected": [0,1]}
    ]

    for i, test in enumerate(test_cases):
        result = two_sum(*test["input"])
        if sorted(result) != sorted(test["expected"]):
            raise Exception(f"Test case {i+1} failed. Expected: {test['expected']}, Got: {result}")

    return "All tests passed!"`
      },
      java: {
        template: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here

    }
}`,
        testRunner: `import java.util.*;

public class TestRunner {
    public static void main(String[] args) {
        Solution solution = new Solution();

        int[][][] testCases = {
            {{2,7,11,15}, {9}},
            {{3,2,4}, {6}},
            {{3,3}, {6}}
        };

        int[][] expectedResults = {
            {0,1},
            {1,2},
            {0,1}
        };

        for (int i = 0; i < testCases.length; i++) {
            int[] result = solution.twoSum(testCases[i][0], testCases[i][1][0]);
            Arrays.sort(result);
            Arrays.sort(expectedResults[i]);

            if (!Arrays.equals(result, expectedResults[i])) {
                System.out.println("Test case " + (i+1) + " failed. Expected: " +
                    Arrays.toString(expectedResults[i]) + ", Got: " + Arrays.toString(result));
                System.exit(1);
            }
        }

        System.out.println("All tests passed!");
    }
}`
      }
    }
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    category: 'String',
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ascii character.'
    ],
    testCases: [
      {
        input: [["h","e","l","l","o"]],
        expectedOutput: ["o","l","l","e","h"]
      },
      {
        input: [["H","a","n","n","a","h"]],
        expectedOutput: ["h","a","n","n","a","H"]
      }
    ],
    languages: {
      javascript: {
        template: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
    // Your code here

};`,
        testRunner: `function runTests() {
    const testCases = [
        { input: [["h","e","l","l","o"]], expected: ["o","l","l","e","h"] },
        { input: [["H","a","n","n","a","h"]], expected: ["h","a","n","n","a","H"] }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const input = [...testCases[i].input[0]]; // Copy array
        reverseString(input);
        if (JSON.stringify(input) !== JSON.stringify(testCases[i].expected)) {
            throw new Error(\`Test case \${i + 1} failed. Expected: \${JSON.stringify(testCases[i].expected)}, Got: \${JSON.stringify(input)}\`);
        }
    }
    return "All tests passed!";
}`
      },
      python: {
        template: `class Solution:
    def reverseString(self, s: List[str]) -> None:
        """
        Do not return anything, modify s in-place instead.
        """
        # Your code here
        pass`,
        testRunner: `from typing import List

def run_tests():
    solution = Solution()

    test_cases = [
        {"input": [["h","e","l","l","o"]], "expected": ["o","l","l","e","h"]},
        {"input": [["H","a","n","n","a","h"]], "expected": ["h","a","n","n","a","H"]}
    ]

    for i, test in enumerate(test_cases):
        input_arr = test["input"][0][:]  # Copy list
        solution.reverseString(input_arr)
        if input_arr != test["expected"]:
            raise Exception(f"Test case {i+1} failed. Expected: {test['expected']}, Got: {input_arr}")

    return "All tests passed!"`
      }
    }
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Number',
    difficulty: 'Easy',
    category: 'Math',
    description: `The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.

Given n, calculate F(n).`,
    examples: [
      {
        input: 'n = 2',
        output: '1',
        explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.'
      },
      {
        input: 'n = 3',
        output: '2',
        explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2.'
      }
    ],
    constraints: [
      '0 <= n <= 30'
    ],
    testCases: [
      { input: [2], expectedOutput: 1 },
      { input: [3], expectedOutput: 2 },
      { input: [4], expectedOutput: 3 },
      { input: [0], expectedOutput: 0 },
      { input: [1], expectedOutput: 1 }
    ],
    languages: {
      javascript: {
        template: `/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
    // Your code here

};`,
        testRunner: `function runTests() {
    const testCases = [
        { input: [2], expected: 1 },
        { input: [3], expected: 2 },
        { input: [4], expected: 3 },
        { input: [0], expected: 0 },
        { input: [1], expected: 1 }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const result = fib(...testCases[i].input);
        if (result !== testCases[i].expected) {
            throw new Error(\`Test case \${i + 1} failed. Expected: \${testCases[i].expected}, Got: \${result}\`);
        }
    }
    return "All tests passed!";
}`
      },
      python: {
        template: `class Solution:
    def fib(self, n: int) -> int:
        # Your code here
        pass`,
        testRunner: `def run_tests():
    solution = Solution()

    test_cases = [
        {"input": [2], "expected": 1},
        {"input": [3], "expected": 2},
        {"input": [4], "expected": 3},
        {"input": [0], "expected": 0},
        {"input": [1], "expected": 1}
    ]

    for i, test in enumerate(test_cases):
        result = solution.fib(*test["input"])
        if result != test["expected"]:
            raise Exception(f"Test case {i+1} failed. Expected: {test['expected']}, Got: {result}")

    return "All tests passed!"`
      },
      java: {
        template: `class Solution {
    public int fib(int n) {
        // Your code here

    }
}`,
        testRunner: `public class TestRunner {
    public static void main(String[] args) {
        Solution solution = new Solution();

        int[][] testCases = {
            {2}, {3}, {4}, {0}, {1}
        };

        int[] expectedResults = {1, 2, 3, 0, 1};

        for (int i = 0; i < testCases.length; i++) {
            int result = solution.fib(testCases[i][0]);
            if (result != expectedResults[i]) {
                System.out.println("Test case " + (i+1) + " failed. Expected: " +
                    expectedResults[i] + ", Got: " + result);
                System.exit(1);
            }
        }

        System.out.println("All tests passed!");
    }
}`
      }
    }
  }
];

module.exports = { problems };
