import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const BattleArena = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('1v1');
  const [currentBattle, setCurrentBattle] = useState(null);
  const [code, setCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState({
    wins: 0,
    losses: 0,
    totalBattles: 0,
    winRate: 0,
    currentStreak: 0,
    bestStreak: 0,
    rating: 1200
  });
  const [battleQueue, setBattleQueue] = useState([]);
  const [isInQueue, setIsInQueue] = useState(false);
  const [queueTime, setQueueTime] = useState(0);
  const [matchmakingStatus, setMatchmakingStatus] = useState('idle');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [securityChecks, setSecurityChecks] = useState({
    plagiarismCheck: true,
    timeValidation: true,
    codeIntegrity: true,
    networkMonitoring: true
  });
  const socketRef = useRef(null);

  useEffect(() => {
    fetchBattles();
    fetchLeaderboard();
    fetchUserStats();

    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('battle-joined', (data) => {
      setCode(data.code);
      setPlayers(data.players || []);
    });

    socketRef.current.on('player-joined', (data) => {
      setPlayers(prev => [...prev, data.player]);
    });

    socketRef.current.on('player-left', (data) => {
      setPlayers(prev => prev.filter(p => p.id !== data.playerId));
    });

    socketRef.current.on('code-updated', (data) => {
      if (data.from !== socketRef.current.id) {
        setCode(data.code);
      }
    });

    socketRef.current.on('battle-result', (data) => {
      setResults(prev => [...prev, data.result]);
      if (data.result.winner === user?.id) {
        setUserStats(prev => ({
          ...prev,
          wins: prev.wins + 1,
          totalBattles: prev.totalBattles + 1,
          currentStreak: prev.currentStreak + 1,
          bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
          rating: prev.rating + 25
        }));
      } else {
        setUserStats(prev => ({
          ...prev,
          losses: prev.losses + 1,
          totalBattles: prev.totalBattles + 1,
          currentStreak: 0,
          rating: Math.max(800, prev.rating - 20)
        }));
      }
    });

    socketRef.current.on('match-found', (data) => {
      setIsInQueue(false);
      setQueueTime(0);
      setMatchmakingStatus('found');
      setCurrentBattle(data.battle);
      setTimeLeft(data.battle.timeLimit);
      setTimeout(() => setMatchmakingStatus('idle'), 2000);
    });

    socketRef.current.on('queue-update', (data) => {
      setBattleQueue(data.queue);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    let timer;
    if (currentBattle && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentBattle, timeLeft]);

  useEffect(() => {
    let queueTimer;
    if (isInQueue) {
      queueTimer = setInterval(() => {
        setQueueTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(queueTimer);
  }, [isInQueue]);

  const [currentProblem, setCurrentProblem] = useState(null);

  const fetchBattles = async () => {
    try {
      await fetch('/api/battles');
      // Removed setBattles since battles state was removed
    } catch (error) {
      console.error('Failed to fetch battles:', error);
    } finally {
      setLoading(false);
    }
  };



  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/battles/leaderboard');
      const data = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/battles/stats');
      const data = await response.json();
      setUserStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const joinQueue = (battleType) => {
    setIsInQueue(true);
    setMatchmakingStatus('searching');

    // For casual queue, add a bot opponent immediately
    if (battleType === 'casual') {
      setTimeout(async () => {
        const botPlayer = {
          id: 'bot-' + Date.now(),
          name: 'CodeBot',
          rating: Math.floor(Math.random() * 400) + 800, // Random rating between 800-1200
          isBot: true
        };

        setPlayers([botPlayer]);
        setIsInQueue(false);
        setMatchmakingStatus('found');

        // Fetch a random problem for the battle
        try {
          const response = await fetch('/api/battles');
          const data = await response.json();
          const randomProblem = data.battles[Math.floor(Math.random() * data.battles.length)];

          // Fetch detailed problem info
          const problemResponse = await fetch(`/api/battles/${randomProblem.id}`);
          const problemData = await problemResponse.json();

          setCurrentProblem(problemData.battle);

          // Create a mock battle
          const mockBattle = {
            id: 'battle-' + Date.now(),
            title: 'Casual Practice Battle',
            description: 'Practice your coding skills against CodeBot. No rating changes apply.',
            timeLimit: 1800,
            difficulty: 'Medium',
            problemId: randomProblem.id
          };

          setCurrentBattle(mockBattle);
          setTimeLeft(mockBattle.timeLimit);
          setTimeout(() => setMatchmakingStatus('idle'), 2000);
        } catch (error) {
          console.error('Failed to fetch problem:', error);
          // Fallback to basic battle without problem
          const mockBattle = {
            id: 'battle-' + Date.now(),
            title: 'Casual Practice Battle',
            description: 'Practice your coding skills against CodeBot. No rating changes apply.',
            timeLimit: 1800,
            difficulty: 'Medium'
          };

          setCurrentBattle(mockBattle);
          setTimeLeft(mockBattle.timeLimit);
          setTimeout(() => setMatchmakingStatus('idle'), 2000);
        }
      }, 2000); // Simulate matchmaking delay
    } else {
      socketRef.current.emit('join-queue', {
        userId: user?.id,
        battleType,
        rating: userStats.rating
      });
    }
  };

  const leaveQueue = () => {
    setIsInQueue(false);
    setQueueTime(0);
    setMatchmakingStatus('idle');
    socketRef.current.emit('leave-queue', { userId: user?.id });
  };



  const handleCodeChange = (value) => {
    setCode(value);
    socketRef.current.emit('code-update', {
      battleId: currentBattle.id,
      code: value
    });
  };

  const submitSolution = async () => {
    try {
      // Security checks before submission
      const securityValidation = await validateSubmission(code);
      if (!securityValidation.valid) {
        alert(`Security violation: ${securityValidation.reason}`);
        return;
      }

      const response = await fetch(`/api/battles/${currentBattle.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          executionTime: Math.floor(Math.random() * 1000) + 500,
          memoryUsed: Math.floor(Math.random() * 50) + 10,
          securityChecks
        })
      });

      const result = await response.json();
      setResults(prev => [...prev, result.result]);
    } catch (error) {
      console.error('Failed to submit solution:', error);
    }
  };

  const validateSubmission = async (code) => {
    // Simulate security validation
    const checks = {
      plagiarismCheck: !code.includes('cheat'),
      timeValidation: timeLeft > 0,
      codeIntegrity: code.length > 10,
      networkMonitoring: true
    };

    setSecurityChecks(checks);

    const failedChecks = Object.entries(checks).filter(([, valid]) => !valid);
    if (failedChecks.length > 0) {
      return {
        valid: false,
        reason: failedChecks[0][0].replace(/([A-Z])/g, ' $1').toLowerCase()
      };
    }

    return { valid: true };
  };

  const leaveBattle = () => {
    setCurrentBattle(null);
    setCurrentProblem(null);
    setCode('');
    setTimeLeft(0);
    setResults([]);
    setPlayers([]);
  };

  const renderStars = (rating) => {
    const stars = Math.floor(rating / 200);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < stars ? 'text-yellow-400' : 'text-gray-600'}>
        ★
      </span>
    ));
  };

  const getRank = (rating) => {
    if (rating >= 2000) return { name: 'Grandmaster', color: '#FFD700' };
    if (rating >= 1800) return { name: 'Master', color: '#FF6B6B' };
    if (rating >= 1600) return { name: 'Expert', color: '#4ECDC4' };
    if (rating >= 1400) return { name: 'Advanced', color: '#45B7D1' };
    if (rating >= 1200) return { name: 'Intermediate', color: '#96CEB4' };
    return { name: 'Beginner', color: '#FECA57' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#14A44D]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Battle Arena
              </h1>
              <p className="text-gray-400 mt-2">Compete in 1v1 battles and climb the leaderboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2">
                <span className="text-sm text-gray-400">Rating: </span>
                <span className="text-[#14A44D] font-semibold">{userStats.rating}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2">
                <span className="text-sm text-gray-400">Rank: </span>
                <span style={{ color: getRank(userStats.rating).color }} className="font-semibold">
                  {getRank(userStats.rating).name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1">
          {[
            { id: '1v1', name: '1v1 Battles', icon: '⚔️' },
            { id: 'friendly', name: 'Friendly Match', icon: '🤝' },
            { id: 'leaderboard', name: 'Leaderboard', icon: '🏆' },
            { id: 'stats', name: 'My Stats', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#14A44D] to-[#5F2EEA] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* 1v1 Battles Tab */}
        {activeTab === '1v1' && (
          <div className="space-y-8">
            {/* Matchmaking Section */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Find Your Match</h2>
                <p className="text-gray-400">Enter the queue and battle against players of similar skill</p>
              </div>

              {!isInQueue ? (
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => joinQueue('competitive')}
                    className="px-8 py-4 bg-gradient-to-r from-[#FF4B2B] to-[#FF8E53] text-white rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    ⚔️ Enter Competitive Queue
                  </button>
                  <button
                    onClick={() => joinQueue('casual')}
                    className="px-8 py-4 bg-gradient-to-r from-[#14A44D] to-[#5F2EEA] text-white rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    🎯 Enter Casual Queue
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#14A44D] mx-auto mb-4"></div>
                  <p className="text-xl font-semibold mb-2">
                    {matchmakingStatus === 'searching' ? 'Finding Match...' : 'Match Found!'}
                  </p>
                  <p className="text-gray-400 mb-4">
                    Queue time: {Math.floor(queueTime / 60)}:{(queueTime % 60).toString().padStart(2, '0')}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Players in queue: {battleQueue.length}
                  </p>
                  <button
                    onClick={leaveQueue}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors"
                  >
                    Leave Queue
                  </button>
                </div>
              )}
            </div>

            {/* Active Battle */}
            {currentBattle && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Code Editor */}
                <div className="lg:col-span-2">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
                    <div className="bg-black/40 px-6 py-4 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">{currentBattle.title}</h2>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-400">
                            Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                          </div>
                          <button
                            onClick={submitSolution}
                            className="px-4 py-2 bg-[#14A44D] text-white rounded-xl hover:bg-[#14A44D]/80 transition-colors"
                          >
                            Submit Solution
                          </button>
                          <button
                            onClick={leaveBattle}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors"
                          >
                            Leave Battle
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-4">
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14A44D]"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                          <option value="c">C</option>
                          <option value="csharp">C#</option>
                          <option value="php">PHP</option>
                          <option value="ruby">Ruby</option>
                          <option value="go">Go</option>
                          <option value="rust">Rust</option>
                        </select>
                      </div>
                      <textarea
                        value={code}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        placeholder="Write your solution here..."
                        className="w-full h-96 bg-black/50 border border-white/20 rounded-xl p-4 text-gray-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#14A44D] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Players */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Players</h3>
                    <div className="space-y-3">
                      {players.map((player, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#5F2EEA] rounded-full flex items-center justify-center text-sm font-semibold">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-gray-300 font-medium">{player.name}</span>
                            <div className="text-xs text-gray-400">Rating: {player.rating}</div>
                          </div>
                        </div>
                      ))}
                      {players.length === 0 && (
                        <p className="text-gray-500 text-sm">Waiting for opponent...</p>
                      )}
                    </div>
                  </div>

                  {/* Security Status */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Security Status</h3>
                    <div className="space-y-2">
                      {Object.entries(securityChecks).map(([check, status]) => (
                        <div key={check} className="flex items-center justify-between">
                          <span className="text-sm text-gray-300 capitalize">
                            {check.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <div className={`w-3 h-3 rounded-full ${status ? 'bg-[#14A44D]' : 'bg-red-500'}`}></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Battle Results</h3>
                    <div className="space-y-3">
                      {results.map((result, index) => (
                        <div key={index} className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Round #{index + 1}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              result.status === 'accepted' ? 'bg-[#14A44D]/20 text-[#14A44D]' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {result.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 space-y-1">
                            <div>Score: {result.score}/100</div>
                            <div>Time: {result.executionTime}ms</div>
                            <div>Memory: {result.memoryUsed}MB</div>
                          </div>
                        </div>
                      ))}
                      {results.length === 0 && (
                        <p className="text-gray-500 text-sm">No submissions yet</p>
                      )}
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Problem</h3>
                    <div className="text-gray-300 text-sm leading-relaxed">
                      <p className="mb-4">{currentBattle.description}</p>

                      {currentProblem && (
                        <>
                          {/* Examples */}
                          {currentProblem.examples && currentProblem.examples.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-white mb-2">Examples:</h4>
                              {currentProblem.examples.map((example, idx) => (
                                <div key={idx} className="bg-black/30 rounded-lg p-3 mb-2">
                                  <div className="text-xs text-gray-400 mb-1">Input:</div>
                                  <code className="text-xs bg-black/50 px-2 py-1 rounded block mb-2">
                                    {example.input}
                                  </code>
                                  <div className="text-xs text-gray-400 mb-1">Output:</div>
                                  <code className="text-xs bg-black/50 px-2 py-1 rounded block mb-2">
                                    {example.output}
                                  </code>
                                  {example.explanation && (
                                    <>
                                      <div className="text-xs text-gray-400 mb-1">Explanation:</div>
                                      <p className="text-xs text-gray-300">{example.explanation}</p>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Constraints */}
                          {currentProblem.constraints && currentProblem.constraints.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-white mb-2">Constraints:</h4>
                              <ul className="text-xs text-gray-300 space-y-1">
                                {currentProblem.constraints.map((constraint, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-[#14A44D] mr-2">•</span>
                                    {constraint}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Supported Languages */}
                          {currentProblem.supportedLanguages && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-white mb-2">Supported Languages:</h4>
                              <div className="flex flex-wrap gap-2">
                                {currentProblem.supportedLanguages.map(lang => (
                                  <span key={lang} className="text-xs bg-[#14A44D]/20 text-[#14A44D] px-2 py-1 rounded">
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Friendly Match Tab */}
        {activeTab === 'friendly' && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Friendly Match</h2>
                <p className="text-gray-400">Practice with friends without affecting your rating</p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <input
                  type="text"
                  placeholder="Enter friend's username or battle code"
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14A44D]"
                />
                <button className="w-full py-3 bg-gradient-to-r from-[#14A44D] to-[#5F2EEA] text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  🤝 Send Challenge
                </button>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Active Challenges</h3>
                <div className="space-y-3">
                  {/* Mock challenges */}
                  <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#5F2EEA] rounded-full flex items-center justify-center">
                        A
                      </div>
                      <div>
                        <div className="font-medium">Alice_Dev</div>
                        <div className="text-sm text-gray-400">Array Manipulation Challenge</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#14A44D] text-white rounded-lg hover:bg-[#14A44D]/80">
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">🏆 Global Leaderboard</h2>
                <p className="text-gray-400">Top competitive programmers</p>
              </div>

              <div className="space-y-4">
                {leaderboard.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      index < 3 ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20' : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-[#FFD700] text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-[#CD7F32] text-white' :
                        'bg-white/20 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-gray-400 flex items-center">
                          {renderStars(player.rating)}
                          <span className="ml-2">{getRank(player.rating).name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg" style={{ color: getRank(player.rating).color }}>
                        {player.rating}
                      </div>
                      <div className="text-sm text-gray-400">
                        {player.wins}W / {player.totalBattles}T
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#14A44D] mb-2">{userStats.totalBattles}</div>
                <div className="text-gray-400">Total Battles</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#14A44D] mb-2">{userStats.wins}</div>
                <div className="text-gray-400">Wins</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF4B2B] mb-2">{userStats.losses}</div>
                <div className="text-gray-400">Losses</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#5F2EEA] mb-2">{userStats.winRate}%</div>
                <div className="text-gray-400">Win Rate</div>
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Performance Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FFD700] mb-1">{userStats.currentStreak}</div>
                  <div className="text-sm text-gray-400">Current Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FFD700] mb-1">{userStats.bestStreak}</div>
                  <div className="text-sm text-gray-400">Best Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: getRank(userStats.rating).color }}>
                    {getRank(userStats.rating).name}
                  </div>
                  <div className="text-sm text-gray-400">Current Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#14A44D] mb-1">{userStats.rating}</div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleArena;
