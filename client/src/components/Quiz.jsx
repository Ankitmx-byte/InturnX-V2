import React, { useEffect, useMemo, useState } from 'react';
import BackButton from './BackButton';
import axios from '../utils/axios';
import { LANGUAGES, MAX_LEVEL, QUIZ_BANK, getLevelsForLanguage } from '../data/quizBank';

const STORAGE_KEY = 'quiz_progress_v1';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

const Quiz = () => {
  const [language, setLanguage] = useState(LANGUAGES[0].key);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');

  const progress = useMemo(() => loadProgress(), []);
  const langProgress = progress[language] || { completedLevels: 0, scores: {} };

  useEffect(() => {
    loadLevel(language, currentLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, currentLevel]);

  const loadLevel = async (lang, level) => {
    setLoading(true);
    try {
      const bank = QUIZ_BANK[lang]?.[level];
      if (!bank || bank.length === 0) {
        setQuestions([]);
      } else {
        setQuestions(bank);
      }
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowSolution(false);
      setQuizCompleted(false);
      setAiExplanation('');
      setScore(0);
    } catch (e) {
      console.error('Failed to load level:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const askAiForExplanation = async (q) => {
    try {
      const payload = {
        question: q.question,
        options: q.options,
        correctIndex: q.answerIndex,
        selectedIndex: selectedAnswer,
        language,
        level: currentLevel,
      };
      const { data } = await axios.post('/api/ai/quiz-explain', payload);
      setAiExplanation(data.explanation || '');
    } catch (e) {
      // Fallback is already the built-in explanation; AI is optional.
      setAiExplanation('');
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return;
    setShowSolution(true);
    setAiExplanation('');

    const q = questions[currentQuestionIndex];
    // Optionally auto-ask AI when the user submits
    await askAiForExplanation(q);

    if (selectedAnswer === q.answerIndex) {
      setScore((s) => s + 1);
    }
  };

  const persistLevelProgress = (passed, finalScore) => {
    const next = loadProgress();
    const langState = next[language] || { completedLevels: 0, scores: {} };
    langState.scores[currentLevel] = finalScore;
    if (passed && langState.completedLevels < currentLevel) {
      langState.completedLevels = currentLevel; // unlock next
    }
    next[language] = langState;
    saveProgress(next);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowSolution(false);
      setAiExplanation('');
    } else {
      setQuizCompleted(true);
      const passed = Math.round((score / questions.length) * 100) >= 70;
      persistLevelProgress(passed, score);
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < MAX_LEVEL) {
      setCurrentLevel((l) => l + 1);
      setScore(0);
    }
  };

  const { definedLevels, maxDefined } = useMemo(() => getLevelsForLanguage(language), [language]);
  const current = questions[currentQuestionIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#14A44D]"></div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white">
        <BackButton />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Level {currentLevel} Complete!
            </h1>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
            <div className="text-center">
              <div className="text-6xl font-bold mb-4" style={{ color: passed ? '#14A44D' : '#FF4B2B' }}>
                {percentage}%
              </div>
              <p className="text-xl text-gray-300 mb-6">
                You scored {score} out of {questions.length} questions
              </p>

              {passed ? (
                <div>
                  <p className="text-green-400 text-lg mb-6">Congratulations! You passed Level {currentLevel}!</p>
                  {currentLevel < MAX_LEVEL && (
                    <button
                      onClick={handleNextLevel}
                      className="bg-gradient-to-r from-[#14A44D] to-[#5F2EEA] text-white py-3 px-8 rounded-full hover:shadow-[#14A44D]/40 transition-all duration-300 transform hover:scale-105 mr-4"
                    >
                      Next Level ({currentLevel + 1})
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-red-400 text-lg mb-6">You need 70% to pass. Try again!</p>
                  <button
                    onClick={() => {
                      setQuizCompleted(false);
                      setCurrentQuestionIndex(0);
                      setSelectedAnswer(null);
                      setShowSolution(false);
                      setScore(0);
                    }}
                    className="bg-gradient-to-r from-[#FF4B2B] to-[#FF8E53] text-white py-3 px-8 rounded-full hover:shadow-[#FF4B2B]/40 transition-all duration-300 transform hover:scale-105 mr-4"
                  >
                    Retry Level {currentLevel}
                  </button>
                </div>
              )}

              <button
                onClick={() => setCurrentLevel(1)}
                className="bg-white/10 text-white py-3 px-8 rounded-full hover:bg-white/20 transition-all duration-300"
              >
                Back to Level 1
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white">
      <BackButton />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Language and Level Selectors */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.key}
                onClick={() => { setLanguage(l.key); setCurrentLevel(1); }}
                className={`px-4 py-2 rounded-full border ${language === l.key ? 'bg-[#14A44D] border-[#14A44D] text-white' : 'bg-white/10 border-white/20 text-gray-200'}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm">Level</span>
            <select
              value={currentLevel}
              onChange={(e) => setCurrentLevel(Number(e.target.value))}
              className="bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-white"
            >
              {Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).map((lvl) => (
                <option key={lvl} value={lvl} disabled={lvl > (langProgress.completedLevels || 0) + 1}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notice for undefined content */}
        {definedLevels.length === 0 || !definedLevels.includes(currentLevel) ? (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-2">Level content coming soon</h3>
            <p className="text-gray-300 text-sm">We haven't added questions for this level yet. Try Level {Math.min(currentLevel, Math.max(1, maxDefined))} or another language.</p>
          </div>
        ) : null}

        {/* Progress bar */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 mb-6">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#5F2EEA] to-[#14A44D] h-2 rounded-full transition-all duration-300"
              style={{ width: `${questions.length ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Question card */}
        {current && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">{current.question}</h2>

            <div className="space-y-4">
              {current.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(idx)}
                  disabled={showSolution}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${selectedAnswer === idx ? 'bg-[#5F2EEA]/20 border-[#5F2EEA] text-white' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'} ${showSolution ? 'cursor-not-allowed' : 'cursor-pointer hover:border-white/30'}`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {!showSolution && (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="w-full mt-6 bg-gradient-to-r from-[#5F2EEA] to-[#14A44D] text-white py-3 px-6 rounded-full hover:shadow-[#5F2EEA]/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            )}
          </div>
        )}

        {/* Solution and AI explanation */}
        {showSolution && current && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 mb-6">
            <div className="flex items-center mb-4">
              {selectedAnswer === current.answerIndex ? (
                <div className="flex items-center text-green-400">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Correct!
                </div>
              ) : (
                <div className="flex items-center text-red-400">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Incorrect
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-white mb-2">Solution:</h3>
              <p className="text-gray-300 mb-2">{current.explanation}</p>
              {current.codeExample && (
                <pre className="text-xs bg-black/40 p-3 rounded-md overflow-auto text-gray-200"><code>{current.codeExample}</code></pre>
              )}

              {aiExplanation && (
                <div className="mt-4 bg-black/30 border border-white/10 p-3 rounded-md">
                  <h4 className="text-sm font-semibold text-white mb-1">AI Explanation</h4>
                  <p className="text-gray-300 text-sm">{aiExplanation}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full bg-gradient-to-r from-[#14A44D] to-[#5F2EEA] text-white py-3 px-6 rounded-full hover:shadow-[#14A44D]/40 transition-all duration-300 transform hover:scale-105"
            >
              {currentQuestionIndex < (questions.length - 1) ? 'Next Question' : 'Complete Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
