const express = require('express');
const router = express.Router();
const { problems } = require('../problems');
const judge0Client = require('../utils/judge0');

// Get available battles (now returns coding problems)
router.get('/', async (req, res) => {
  try {
    // Convert problems to battle format
    const battles = problems.map(problem => ({
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      description: problem.description,
      timeLimit: 1800, // 30 minutes default
      players: Math.floor(Math.random() * 4), // Mock active players
      maxPlayers: 4,
      status: 'active',
      category: problem.category,
      examples: problem.examples,
      constraints: problem.constraints
    }));

    res.json({ battles });
  } catch (error) {
    console.error('Error fetching battles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific battle/problem details
router.get('/:battleId', async (req, res) => {
  try {
    const { battleId } = req.params;
    const problem = problems.find(p => p.id === battleId);

    if (!problem) {
      return res.status(404).json({ message: 'Battle not found' });
    }

    const battle = {
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      description: problem.description,
      timeLimit: 1800,
      category: problem.category,
      examples: problem.examples,
      constraints: problem.constraints,
      supportedLanguages: Object.keys(problem.languages)
    };

    res.json({ battle });
  } catch (error) {
    console.error('Error fetching battle:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new battle
router.post('/', async (req, res) => {
  try {
    const { title, description, difficulty, timeLimit, maxPlayers } = req.body;

    // In real app, save to database
    const battle = {
      id: `battle-${Date.now()}`,
      title,
      description,
      difficulty,
      timeLimit,
      players: 0,
      maxPlayers,
      status: 'active',
      createdAt: new Date()
    };

    res.status(201).json({ battle });
  } catch (error) {
    console.error('Error creating battle:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit battle solution
router.post('/:battleId/submit', async (req, res) => {
  try {
    const { battleId } = req.params;
    const { code, language } = req.body;
    const userId = req.user?.id;

    // Find the problem
    const problem = problems.find(p => p.id === battleId);
    if (!problem) {
      return res.status(404).json({ message: 'Battle not found' });
    }

    // Check if language is supported
    if (!problem.languages[language]) {
      return res.status(400).json({ message: `Language ${language} not supported for this problem` });
    }

    // Run test cases using Judge0
    const testResults = await judge0Client.runTestCases(code, language, problem.testCases);

    const result = {
      battleId,
      userId,
      code,
      language,
      status: testResults.summary.status,
      score: testResults.summary.score,
      executionTime: testResults.summary.totalTime,
      memoryUsed: testResults.summary.maxMemory,
      testResults: testResults.results,
      submittedAt: new Date()
    };

    res.json({ result });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ message: 'Server error during code execution' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    // Mock leaderboard - in real app, fetch from database
    const leaderboard = [
      { id: '1', name: 'CodeMaster', rating: 1850, wins: 45, totalBattles: 50, winRate: 90 },
      { id: '2', name: 'AlgoQueen', rating: 1720, wins: 38, totalBattles: 45, winRate: 84 },
      { id: '3', name: 'DevWarrior', rating: 1680, wins: 42, totalBattles: 55, winRate: 76 },
      { id: '4', name: 'LogicLord', rating: 1650, wins: 35, totalBattles: 48, winRate: 73 },
      { id: '5', name: 'SyntaxSage', rating: 1620, wins: 40, totalBattles: 60, winRate: 67 }
    ];

    res.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user stats
router.get('/stats', async (req, res) => {
  try {
    // Mock user stats - in real app, fetch from database based on user ID
    const stats = {
      wins: 12,
      losses: 8,
      totalBattles: 20,
      winRate: 60,
      currentStreak: 3,
      bestStreak: 7,
      rating: 1450,
      rank: 'Intermediate'
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
