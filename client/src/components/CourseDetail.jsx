import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      // Mock course data - in real app, fetch from API
      const mockCourse = {
        id: id,
        title: 'Introduction to JavaScript',
        description: 'Learn the fundamentals of JavaScript programming',
        level: 'Beginner',
        duration: '4 weeks',
        lessons: [
          {
            id: 1,
            title: 'Variables and Data Types',
            content: `
# Variables and Data Types

JavaScript variables are containers for storing data values. You can declare variables using \`var\`, \`let\`, or \`const\`.

## Declaring Variables

\`\`\`javascript
// Using var (not recommended for modern JS)
var name = "John";

// Using let (can be reassigned)
let age = 25;
age = 26; // This is allowed

// Using const (cannot be reassigned)
const PI = 3.14159;
// PI = 3.14; // This would cause an error
\`\`\`

## Data Types

JavaScript has several built-in data types:

- **String**: Text data (e.g., "Hello World")
- **Number**: Numeric data (e.g., 42, 3.14)
- **Boolean**: True/false values
- **Array**: Ordered list of values
- **Object**: Collection of key-value pairs
- **null** and **undefined**: Special values

## Example

\`\`\`javascript
let name = "Alice";        // String
let age = 30;             // Number
let isStudent = true;     // Boolean
let hobbies = ["reading", "coding"]; // Array
let person = {            // Object
  name: "Alice",
  age: 30
};
\`\`\`
            `,
            quiz: [
              {
                question: "Which keyword is used to declare a constant in JavaScript?",
                options: ["var", "let", "const", "static"],
                correct: 2
              },
              {
                question: "What data type is used to store true/false values?",
                options: ["String", "Number", "Boolean", "Array"],
                correct: 2
              }
            ]
          },
          {
            id: 2,
            title: 'Functions and Scope',
            content: `
# Functions and Scope

Functions are blocks of code designed to perform a particular task. They are executed when they are called (invoked).

## Function Declaration

\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alice")); // Output: Hello, Alice!
\`\`\`

## Function Expression

\`\`\`javascript
const greet = function(name) {
  return "Hello, " + name + "!";
};
\`\`\`

## Arrow Functions (ES6+)

\`\`\`javascript
const greet = (name) => {
  return "Hello, " + name + "!";
};

// Or more concisely:
const greet = name => "Hello, " + name + "!";
\`\`\`

## Scope

Scope determines the accessibility of variables:

- **Global Scope**: Variables declared outside any function
- **Local Scope**: Variables declared inside a function
- **Block Scope**: Variables declared with \`let\` or \`const\` inside blocks

\`\`\`javascript
let globalVar = "I'm global";

function example() {
  let localVar = "I'm local";
  if (true) {
    let blockVar = "I'm block-scoped";
  }
  // blockVar is not accessible here
}
\`\`\`
            `,
            quiz: [
              {
                question: "What is the correct syntax for an arrow function?",
                options: ["function() => {}", "() => function{}", "(param) => {}", "=> (param) {}"],
                correct: 2
              }
            ]
          }
        ]
      };
      setCourse(mockCourse);
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = async (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
      const newProgress = ((completedLessons.length + 1) / course.lessons.length) * 100;
      setProgress(newProgress);

      // Update progress on server
      try {
        await axios.post('/api/courses/progress', {
          courseId: id,
          lessonId,
          progress: newProgress
        });
      } catch (error) {
        console.error('Failed to update progress:', error);
      }
    }
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setQuizAnswers({});
    setQuizScore(null);
  };

  const submitQuiz = () => {
    const currentLessonData = course.lessons[currentLesson];
    let score = 0;
    currentLessonData.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        score++;
      }
    });
    setQuizScore(score);
    if (score === currentLessonData.quiz.length) {
      markLessonComplete(currentLessonData.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#14A44D]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Link to="/learning" className="text-[#14A44D] hover:underline">
            Back to Learning Hub
          </Link>
        </div>
      </div>
    );
  }

  const currentLessonData = course.lessons[currentLesson];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/learning" className="text-[#14A44D] hover:underline mb-2 inline-block">
                ← Back to Learning Hub
              </Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {course.title}
              </h1>
              <p className="text-gray-400 mt-2">{course.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2">
                <span className="text-sm text-gray-400">Progress: </span>
                <span className="text-[#14A44D] font-semibold">{Math.round(progress)}%</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2">
                <span className="text-sm text-gray-400">Level: </span>
                <span className="text-[#5F2EEA] font-semibold">{course.level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lessons Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Course Content</h3>
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(index)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                      currentLesson === index
                        ? 'bg-[#14A44D]/20 border border-[#14A44D]/30'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        completedLessons.includes(lesson.id)
                          ? 'bg-[#14A44D] text-white'
                          : currentLesson === index
                          ? 'bg-[#5F2EEA] text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {completedLessons.includes(lesson.id) ? '✓' : index + 1}
                      </div>
                      <span className={`text-sm ${
                        currentLesson === index ? 'text-white font-medium' : 'text-gray-300'
                      }`}>
                        {lesson.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!showQuiz ? (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">{currentLessonData.title}</h2>

                {/* Lesson Content */}
                <div className="prose prose-invert max-w-none mb-8">
                  <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                    {currentLessonData.content}
                  </pre>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                    disabled={currentLesson === 0}
                    className="px-6 py-3 bg-gray-600 text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
                  >
                    Previous Lesson
                  </button>

                  <div className="flex space-x-4">
                    {currentLessonData.quiz && (
                      <button
                        onClick={startQuiz}
                        className="px-6 py-3 bg-[#5F2EEA] text-white rounded-xl hover:bg-[#5F2EEA]/80 transition-colors"
                      >
                        Take Quiz
                      </button>
                    )}

                    <button
                      onClick={() => setCurrentLesson(Math.min(course.lessons.length - 1, currentLesson + 1))}
                      disabled={currentLesson === course.lessons.length - 1}
                      className="px-6 py-3 bg-[#14A44D] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#14A44D]/80 transition-colors"
                    >
                      Next Lesson
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Quiz Interface */
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Lesson Quiz</h2>

                {quizScore === null ? (
                  <div className="space-y-6">
                    {currentLessonData.quiz.map((question, qIndex) => (
                      <div key={qIndex} className="bg-white/5 rounded-xl p-6">
                        <h3 className="text-lg font-medium mb-4">{question.question}</h3>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <label key={oIndex} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name={`question-${qIndex}`}
                                value={oIndex}
                                onChange={(e) => setQuizAnswers({
                                  ...quizAnswers,
                                  [qIndex]: parseInt(e.target.value)
                                })}
                                className="text-[#14A44D] focus:ring-[#14A44D]"
                              />
                              <span className="text-gray-300">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between">
                      <button
                        onClick={() => setShowQuiz(false)}
                        className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-colors"
                      >
                        Back to Lesson
                      </button>
                      <button
                        onClick={submitQuiz}
                        className="px-6 py-3 bg-[#14A44D] text-white rounded-xl hover:bg-[#14A44D]/80 transition-colors"
                      >
                        Submit Quiz
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Quiz Results */
                  <div className="text-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                      quizScore === currentLessonData.quiz.length
                        ? 'bg-[#14A44D]/20'
                        : 'bg-[#FF4B2B]/20'
                    }`}>
                      <span className={`text-3xl font-bold ${
                        quizScore === currentLessonData.quiz.length
                          ? 'text-[#14A44D]'
                          : 'text-[#FF4B2B]'
                      }`}>
                        {quizScore}/{currentLessonData.quiz.length}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">
                      {quizScore === currentLessonData.quiz.length
                        ? 'Perfect! Lesson Completed! 🎉'
                        : 'Good try! Review the material and try again.'}
                    </h3>

                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setShowQuiz(false)}
                        className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-colors"
                      >
                        Back to Lesson
                      </button>
                      {quizScore === currentLessonData.quiz.length && (
                        <button
                          onClick={() => setCurrentLesson(Math.min(course.lessons.length - 1, currentLesson + 1))}
                          className="px-6 py-3 bg-[#14A44D] text-white rounded-xl hover:bg-[#14A44D]/80 transition-colors"
                        >
                          Next Lesson
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
