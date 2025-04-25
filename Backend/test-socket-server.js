// Simple standalone Socket.IO server for testing
import http from 'http';
import { Server } from 'socket.io';
import medicalQuestions from './data/medicalQuestions.js';

// Create HTTP server
const server = http.createServer();

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store active game rooms
const gameRooms = new Map();

// Generate a random 6-character room code
const generateRoomCode = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Get random questions from the question pool
const getRandomQuestions = (questionPool, count = 10) => {
  const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Calculate XP earned based on score and win status
const calculateXP = (score, didWin) => {
  let xp = score; // Base XP equals the score
  
  if (didWin) {
    xp += 50; // Bonus for winning
  }
  
  // Bonus for high scores
  if (score >= 80) {
    xp += 30;
  } else if (score >= 50) {
    xp += 15;
  }
  
  return xp;
};

// Set up connection event
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle room creation
  socket.on('create-room', async (data) => {
    try {
      const { userId, username, avatar } = data;
      
      // Generate a unique room code
      let roomCode;
      do {
        roomCode = generateRoomCode();
      } while (gameRooms.has(roomCode));
      
      // Create a new room
      gameRooms.set(roomCode, {
        id: roomCode,
        host: {
          id: userId,
          socketId: socket.id,
          username,
          avatar,
          score: 0,
          answers: []
        },
        guest: null,
        status: 'waiting', // waiting, playing, completed
        questions: [],
        createdAt: new Date(),
        gameStartTime: null,
        gameEndTime: null
      });
      
      // Join the socket room
      socket.join(roomCode);
      
      // Send room code back to client
      socket.emit('room-created', { roomCode });
      
      console.log(`Room created: ${roomCode} by ${username}`);
    } catch (error) {
      console.error('Error creating room:', error);
      socket.emit('error-message', { message: 'Failed to create room. Please try again.' });
    }
  });

  // Handle joining a room
  socket.on('join-room', async (data) => {
    try {
      const { roomCode, userId, username, avatar } = data;
      
      // Check if room exists
      if (!gameRooms.has(roomCode)) {
        socket.emit('room-not-found');
        return;
      }
      
      const room = gameRooms.get(roomCode);
      
      // Check if room is full or already playing
      if (room.guest || room.status !== 'waiting') {
        socket.emit('error-message', { message: 'Room is full or game has already started.' });
        return;
      }
      
      // Join the room
      socket.join(roomCode);
      
      // Add player to the room
      room.guest = {
        id: userId,
        socketId: socket.id,
        username,
        avatar,
        score: 0,
        answers: []
      };
      
      // Update room status
      room.status = 'ready';
      
      // Get random questions
      const gameQuestions = getRandomQuestions(medicalQuestions, 10);
      
      // Save questions to room
      room.questions = gameQuestions;
      room.gameStartTime = new Date();
      
      // Notify host that a player joined
      io.to(room.host.socketId).emit('player-joined', { 
        player: { username: room.guest.username, avatar: room.guest.avatar, id: room.guest.id } 
      });
      
      // Notify guest about the host
      socket.emit('player-joined', { 
        player: { username: room.host.username, avatar: room.host.avatar, id: room.host.id } 
      });
      
      // Send questions to both players
      setTimeout(() => {
        io.to(roomCode).emit('game-started', { questions: gameQuestions });
        room.status = 'playing';
      }, 3000);
      
      console.log(`${username} joined room: ${roomCode}`);
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error-message', { message: 'Failed to join room. Please try again.' });
    }
  });

  // Handle player answers
  socket.on('player-answer', (data) => {
    try {
      const { roomCode, questionIndex, answerIndex, isCorrect } = data;
      
      if (!gameRooms.has(roomCode)) return;
      
      const room = gameRooms.get(roomCode);
      const isHost = room.host.socketId === socket.id;
      const player = isHost ? room.host : room.guest;
      const opponent = isHost ? room.guest : room.host;
      
      // Record the answer
      player.answers.push({ questionIndex, answerIndex, isCorrect });
      
      // Update score
      if (isCorrect) {
        player.score += 10;
      }
      
      // Notify opponent of answer
      if (opponent) {
        io.to(opponent.socketId).emit('opponent-answer', {
          questionIndex,
          answerIndex,
          isCorrect
        });
      }
    } catch (error) {
      console.error('Error processing answer:', error);
    }
  });

  // Handle game completion
  socket.on('game-completed', (data) => {
    try {
      const { roomCode } = data;
      
      if (!gameRooms.has(roomCode)) return;
      
      const room = gameRooms.get(roomCode);
      room.status = 'completed';
      room.gameEndTime = new Date();
      
      // Calculate game duration
      const duration = Math.floor((room.gameEndTime - room.gameStartTime) / 1000);
      
      // Determine winner
      let winner;
      if (room.host.score > room.guest.score) {
        winner = room.host.id;
      } else if (room.guest.score > room.host.score) {
        winner = room.guest.id;
      } else {
        winner = 'tie';
      }
      
      // Calculate XP earned (base XP + bonuses)
      const hostXP = calculateXP(room.host.score, winner === room.host.id);
      const guestXP = calculateXP(room.guest.score, winner === room.guest.id);
      
      // Send results to both players
      io.to(room.host.socketId).emit('game-results', {
        winner,
        playerScore: room.host.score,
        opponentScore: room.guest.score,
        timeToComplete: duration,
        xpEarned: hostXP
      });
      
      io.to(room.guest.socketId).emit('game-results', {
        winner,
        playerScore: room.guest.score,
        opponentScore: room.host.score,
        timeToComplete: duration,
        xpEarned: guestXP
      });
      
      // Clean up the room after 5 minutes
      setTimeout(() => {
        gameRooms.delete(roomCode);
        console.log(`Room ${roomCode} cleaned up`);
      }, 5 * 60 * 1000);
      
    } catch (error) {
      console.error('Error completing game:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Find and clean up any rooms where this socket was a player
    for (const [roomCode, room] of gameRooms.entries()) {
      if (room.host.socketId === socket.id) {
        // Host left, notify guest and close room
        if (room.guest && room.status === 'playing') {
          io.to(room.guest.socketId).emit('error-message', { 
            message: 'Your opponent has disconnected. Game ended.' 
          });
        }
        gameRooms.delete(roomCode);
      } else if (room.guest && room.guest.socketId === socket.id) {
        // Guest left, notify host and close room
        if (room.status === 'playing') {
          io.to(room.host.socketId).emit('error-message', { 
            message: 'Your opponent has disconnected. Game ended.' 
          });
        }
        gameRooms.delete(roomCode);
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log(`Testing URL: http://localhost:${PORT}`);
}); 