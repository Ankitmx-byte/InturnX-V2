require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Initialize database
const { connectDB } = require('./database');
connectDB();

// Import routes
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const battlesRoutes = require('./routes/battles');
const aiRoutes = require('./routes/ai');
const projectsRoutes = require('./routes/projects');
const internshipsRoutes = require('./routes/internships');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/battles', battlesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/internships', internshipsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'InturnX Server is running' });
});

// Socket.io for real-time coding battles
const battles = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-battle', (battleId) => {
    socket.join(battleId);
    if (!battles.has(battleId)) {
      battles.set(battleId, { players: [], code: '' });
    }
    const battle = battles.get(battleId);
    battle.players.push(socket.id);

    socket.emit('battle-joined', { battleId, code: battle.code });
    socket.to(battleId).emit('player-joined', { playerId: socket.id });
  });

  socket.on('code-update', (data) => {
    const { battleId, code } = data;
    const battle = battles.get(battleId);
    if (battle) {
      battle.code = code;
      socket.to(battleId).emit('code-updated', { code, from: socket.id });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove from battles
    for (const [battleId, battle] of battles.entries()) {
      const index = battle.players.indexOf(socket.id);
      if (index > -1) {
        battle.players.splice(index, 1);
        if (battle.players.length === 0) {
          battles.delete(battleId);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
