import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getCurrentUser } from '../utils/auth';
import { Trophy, Users, Copy, ArrowLeft, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Particles } from '../components/particles';

// Update the socket server URL to point to the correct backend
const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://healthquest-n0i2.onrender.com';
console.log('Competitive Mode: Using socket server at:', API_URL);
let socket;

function CompetitiveMode() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState('lobby'); // lobby, waiting, playing, results
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [opponent, setOpponent] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [opponentAnswers, setOpponentAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting, connected, error
  const [roomCreator, setRoomCreator] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  // Force set to error state for testing (remove this in production)
  // useEffect(() => {
  //   setTimeout(() => {
  //     setConnectionStatus('connected');
  //   }, 1000);
  // }, []);

  // Connect to socket server
  useEffect(() => {
    const userData = getCurrentUser();
    console.log('Current user:', userData);
    
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);

    // Socket connection function
    const connectSocket = () => {
      try {
        // Initialize socket connection with explicit URL
        console.log('Connecting to socket at:', API_URL);
        socket = io(API_URL, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          autoConnect: true
        });

        socket.on('connect', () => {
          console.log('Successfully connected to server with ID:', socket.id);
          setConnectionStatus('connected');
          setErrorMessage('');
        });

        socket.on('connect_error', (error) => {
          console.error('Socket connection error details:', error.message);
          setErrorMessage(`Unable to connect to game server: ${error.message}. Please try again later.`);
          setConnectionStatus('error');
        });

        socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          if (reason === 'io server disconnect') {
            // The server has forcefully disconnected the socket
            setTimeout(() => {
              socket.connect(); // Manually reconnect
            }, 1000);
          }
          setConnectionStatus('error');
        });

        socket.on('room-created', (data) => {
          setRoomCode(data.roomCode);
          setGameState('waiting');
          setRoomCreator(user.id);
        });

        socket.on('player-joined', (data) => {
          setOpponent(data.player);
          setGameState('ready');
          
          // if joining a room, make sure roomCreator is explicitly set to null
          if (gameState === 'waiting') {
            // Preserve roomCreator for the host
          } else {
            // This player is joining someone else's room
            setRoomCreator(null);
          }
          
          // Start game after 3 seconds
          setTimeout(() => {
            setGameState('playing');
          }, 3000);
        });

        socket.on('game-started', (data) => {
          console.log('Game started with data:', data);
          setQuestions(data.questions);
          setGameState('playing');
          
          // Store the host and guest IDs for more reliable player role determination
          if (data.hostId && data.guestId) {
            setRoomCreator(data.hostId);
          }
        });

        // Handle opponent leaving
        socket.on('opponent-left', () => {
          setOpponentDisconnected(true);
        });

        // Handle score updates from server
        socket.on('score-update', (data) => {
          console.log('Received score-update event with data:', data);
          
          // Check if we have valid score data
          if (typeof data.playerScore === 'number' && typeof data.opponentScore === 'number') {
            // Update both scores directly from server data
            setPlayerScore(data.playerScore);
            setOpponentScore(data.opponentScore);
            
            // Update player names
            if (data.playerName) setPlayerName(data.playerName);
            if (data.opponentName) setOpponentName(data.opponentName);
            
            // Set isHost flag
            if (typeof data.playerIsHost === 'boolean') setIsHost(data.playerIsHost);
            
            console.log(`Scores updated via server - Player: ${data.playerScore}, Opponent: ${data.opponentScore}`);
          } else {
            console.error('Received score update with invalid data:', data);
          }
        });

        // Handle opponent answers - update both the UI and the score
        socket.on('opponent-answer', (data) => {
          console.log('Received opponent answer:', data);
          
          // Store opponent's answer data for UI feedback
          setOpponentAnswers((prev) => {
            // Check if this answer already exists to avoid duplicates
            const exists = prev.some(a => a.questionIndex === data.questionIndex);
            if (exists) {
              console.log('This opponent answer was already recorded, ignoring duplicate');
              return prev;
            }
            
            console.log(`Adding opponent answer for question ${data.questionIndex}, correct: ${data.isCorrect}`);
            return [...prev, {
              questionIndex: data.questionIndex,
              answerIndex: data.answerIndex,
              isCorrect: data.isCorrect
            }];
          });
          
          // Update opponent score directly when their answer is correct
          // This ensures the score updates visually even if server updates fail
          if (data.isCorrect) {
            setOpponentScore(prev => prev + 10);
            console.log(`Directly updating opponent score for correct answer: +10`);
          }
          
          // Request a score update from the server as a backup
          socket.emit('request-scores', { roomCode });
        });

        socket.on('next-question', () => {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setTimeLeft(20);
        });

        socket.on('game-results', (data) => {
          setGameState('results');
          setResults(data);
        });

        socket.on('room-not-found', () => {
          setErrorMessage('Room not found. Please check the code and try again.');
        });

        socket.on('error-message', (data) => {
          setErrorMessage(data.message);
        });
      } catch (error) {
        console.error('Error setting up socket connection:', error);
        setErrorMessage('Unable to connect to game server. Please try again later.');
        setConnectionStatus('error');
      }
    };

    // Initial connection attempt
    connectSocket();

    // Clean up socket connection on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [navigate]);

  // Timer for questions
  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      // Time's up, send empty answer
      handleAnswer(null);
    }

    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // Add a new useEffect to keep track of score changes and log them to help debug
  useEffect(() => {
    console.log(`SCORE UPDATED - Player: ${playerScore}, Opponent: ${opponentScore}`);
  }, [playerScore, opponentScore]);

  const createRoom = () => {
    if (!user) return;
    
    // Reset scores and game state when creating a new room
    setPlayerScore(0);
    setOpponentScore(0);
    setPlayerAnswers([]);
    setOpponentAnswers([]);
    
    socket.emit('create-room', {
      userId: user.id,
      username: user.username,
      avatar: user.avatar
    });
  };

  const joinRoom = () => {
    if (!joinCode.trim() || !user) {
      setErrorMessage('Please enter a valid room code');
      return;
    }

    // Reset scores and game state when joining a room
    setPlayerScore(0);
    setOpponentScore(0);
    setPlayerAnswers([]);
    setOpponentAnswers([]);
    
    socket.emit('join-room', {
      roomCode: joinCode,
      userId: user.id,
      username: user.username,
      avatar: user.avatar
    });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return; // Prevent multiple answers

    const currentQ = questions[currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;
    
    setSelectedAnswer(answerIndex);
    
    // Update player's own score locally for immediate feedback
    if (isCorrect) {
      setPlayerScore(prev => prev + 10);
      console.log(`Updating own score locally for correct answer: +10`);
    }
    
    // Log detailed information about the player's role when sending answer
    const isRoomCreator = user.id === roomCreator;
    console.log(`Sending answer as ${isRoomCreator ? 'CREATOR' : 'JOINER'} - roomCreator=${roomCreator}, userId=${user.id}`);
    
    // Send answer to server with explicit role information
    socket.emit('player-answer', {
      roomCode,
      userId: user.id,
      username: user.username,
      questionIndex: currentQuestion,
      answerIndex,
      isCorrect,
      isRoomCreator: isRoomCreator  // Add explicit role information to help server
    });

    // Store player answer locally for UI feedback
    setPlayerAnswers(prev => [...prev, {
      questionIndex: currentQuestion,
      answerIndex,
      isCorrect
    }]);

    // Send multiple requests for score updates to ensure synchronization
    setTimeout(() => {
      console.log('Requesting score update after 500ms');
      socket.emit('request-scores', { 
        roomCode, 
        userId: user.id,
        isRoomCreator: isRoomCreator 
      });
    }, 500);
    
    setTimeout(() => {
      console.log('Requesting score update after 1000ms');
      socket.emit('request-scores', { 
        roomCode, 
        userId: user.id,
        isRoomCreator: isRoomCreator
      });
    }, 1000);

    // Move to next question after 2 seconds
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(20);
      }, 2000);
    } else {
      // Last question, wait for results
      setTimeout(() => {
        socket.emit('game-completed', { roomCode });
      }, 2000);
    }
  };

  // Add a function to debug and fix opponent answers format if needed
  const getOpponentAnswer = (questionIndex) => {
    if (!opponentAnswers || opponentAnswers.length === 0) return null;
    
    // Find the opponent's answer for this specific question
    const answer = opponentAnswers.find(a => a.questionIndex === questionIndex);
    
    // If we have a legacy format (just boolean values), handle it gracefully
    if (answer === true || answer === false) {
      console.warn('Found legacy format opponent answer, converting to object format');
      return { questionIndex, isCorrect: answer, answerIndex: null };
    }
    
    return answer;
  };

  const renderLobby = () => (
    <div className="game-card max-w-md mx-auto p-6">
      <h1 className="text-3xl font-russo mb-6 text-center text-green-300">Competitive Mode</h1>
      
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Trophy className="inline-block text-yellow-400 mb-3" size={48} />
          <p className="text-green-100/70 mb-4">Challenge friends to a medical knowledge duel! Create a room or join one to start.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={createRoom}
            className="game-button py-3 flex justify-center items-center"
          >
            <Users className="mr-2" size={20} />
            Create New Room
          </button>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Room Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full py-3 px-4 bg-green-900/50 border border-green-700/50 rounded-lg text-white placeholder-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-400/30"
            />
            <button 
              onClick={joinRoom}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 game-button-small py-1.5 px-3"
            >
              Join
            </button>
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-400 text-sm text-center mt-2">{errorMessage}</p>
        )}
      </div>
    </div>
  );

  const renderWaitingRoom = () => (
    <div className="game-card max-w-md mx-auto p-6">
      <h1 className="text-3xl font-russo mb-6 text-center text-green-300">Waiting for Opponent</h1>
      
      <div className="text-center mb-8">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-pulse mb-4">
            <Users className="text-green-300" size={48} />
          </div>
          <p className="text-green-100/70 mb-6">Share this code with your friend to join:</p>
          
          <div className="relative bg-green-900/50 border border-green-700/50 rounded-lg px-4 py-3 mb-6">
            <span className="text-2xl font-mono text-white tracking-wider">{roomCode}</span>
            <button 
              onClick={copyRoomCode}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 p-1.5 rounded-md bg-green-700/30 hover:bg-green-700/50 transition-colors"
            >
              <Copy size={16} className="text-green-300" />
            </button>
          </div>
          
          <div className="text-sm text-green-200/70">
            Waiting for another player to join...
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => navigate('/dashboard')}
        className="game-button-small py-2 w-full flex items-center justify-center"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Dashboard
      </button>
    </div>
  );

  const renderReadyScreen = () => (
    <div className="game-card max-w-md mx-auto p-6 text-center">
      <h1 className="text-3xl font-russo mb-4 text-center text-green-300">Get Ready!</h1>
      
      <div className="flex justify-around items-center mb-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-800/60 border-2 border-green-400/30 mx-auto flex items-center justify-center overflow-hidden mb-2">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=fallback&backgroundColor=b6e3f4';
                }}
              />
            ) : (
              <Users size={24} className="text-green-300" />
            )}
          </div>
          <p className="text-white font-medium">{user?.username}</p>
        </div>
        
        <div className="text-green-300 text-lg font-bold">VS</div>
        
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-800/60 border-2 border-green-400/30 mx-auto flex items-center justify-center overflow-hidden mb-2">
            {opponent?.avatar ? (
              <img 
                src={opponent.avatar}
                alt={opponent.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=fallback&backgroundColor=b6e3f4';
                }}
              />
            ) : (
              <Users size={24} className="text-green-300" />
            )}
          </div>
          <p className="text-white font-medium">{opponent?.username}</p>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-green-300 animate-pulse">
        Game starting in seconds...
      </div>
    </div>
  );

  const renderGameplay = () => {
    if (!questions.length) return <div className="text-center">Loading questions...</div>;
    
    const currentQ = questions[currentQuestion];
    
    // Find opponent's answer for this question using the helper function
    const opponentAnswer = getOpponentAnswer(currentQuestion);
    
    return (
      <div className="max-w-2xl mx-auto">
        {opponentDisconnected && (
          <div className="game-card p-3 mb-4 bg-red-900/40 border border-red-500/50 flex items-center justify-center">
            <AlertCircle className="text-red-400 mr-2" size={18} />
            <p className="text-white">Your opponent has disconnected. You can continue playing to complete the game.</p>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <div className="game-card px-3 py-2 inline-flex items-center">
            <div className="mr-2">Q</div>
            <div className="font-bold">{currentQuestion + 1}/{questions.length}</div>
          </div>
          
          <div className="game-card px-3 py-2 inline-flex items-center">
            <Clock className="text-yellow-400 mr-2" size={16} />
            <div className="font-bold">{timeLeft}s</div>
          </div>
        </div>
        
        <div className="game-card p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-medium text-green-300 mb-6">{currentQ.question}</h2>
          
          <div className="grid grid-cols-1 gap-3 mb-6">
            {currentQ.options.map((option, index) => {
              const isPlayerSelected = selectedAnswer === index;
              const isOpponentSelected = opponentAnswer && opponentAnswer.answerIndex === index;
              const isCorrect = index === currentQ.correctAnswer;
              
              let borderClass = "border-green-700/50";
              if (selectedAnswer !== null && isCorrect) {
                borderClass = "border-green-500";
              } else if (isPlayerSelected && !isCorrect) {
                borderClass = "border-red-500";
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`relative text-left p-4 bg-green-900/40 border-2 ${borderClass} rounded-lg hover:bg-green-800/50 transition-colors ${
                    isPlayerSelected ? 'bg-green-800/70' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{option}</span>
                    
                    <div className="flex items-center">
                      {selectedAnswer !== null && isCorrect && (
                        <CheckCircle className="text-green-400 ml-2" size={20} />
                      )}
                      {isPlayerSelected && !isCorrect && (
                        <XCircle className="text-red-400 ml-2" size={20} />
                      )}
                    </div>
                  </div>
                  
                  {isOpponentSelected && (
                    <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                      <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center overflow-hidden">
                        {opponent?.avatar ? (
                          <img 
                            src={opponent.avatar}
                            alt={opponent.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users size={12} className="text-white" />
                        )}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-between text-center">
          <div className="game-card p-3 w-[45%]">
            <div className="text-sm text-green-200/70 mb-1">Your Score</div>
            <div className="text-2xl font-bold text-green-300">{playerScore}</div>
          </div>
          
          <div className="game-card p-3 w-[45%]">
            <div className="text-sm text-green-200/70 mb-1">{opponent?.username || 'Opponent'}</div>
            <div className="text-2xl font-bold text-green-300">{opponentScore}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return <div className="text-center">Loading results...</div>;
    
    const playerWon = results.winner === user?.id;
    const isTie = results.winner === 'tie';
    
    return (
      <div className="game-card max-w-md mx-auto p-6 text-center">
        <h1 className="text-3xl font-russo mb-4 text-center text-green-300">Game Over!</h1>
        
        {opponentDisconnected && (
          <div className="bg-red-900/40 border border-red-500/50 p-3 mb-4 rounded-lg">
            <p className="text-white flex items-center justify-center">
              <AlertCircle className="text-red-400 mr-2" size={18} />
              Opponent disconnected during the game
            </p>
          </div>
        )}
        
        {isTie ? (
          <div className="text-2xl font-bold text-yellow-400 mb-6">It's a Tie!</div>
        ) : (
          <div className="text-2xl font-bold text-yellow-400 mb-6">
            {playerWon ? 'You Won!' : 'You Lost!'}
          </div>
        )}
        
        <div className="flex justify-around items-center mb-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-800/60 border-2 border-green-400/30 mx-auto flex items-center justify-center overflow-hidden mb-2">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users size={24} className="text-green-300" />
              )}
            </div>
            <p className="text-white font-medium">{user?.username}</p>
            <p className="text-green-300 font-bold text-xl">{playerScore}</p>
          </div>
          
          <div className="text-green-300 text-lg font-bold">VS</div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-800/60 border-2 border-green-400/30 mx-auto flex items-center justify-center overflow-hidden mb-2">
              {opponent?.avatar ? (
                <img 
                  src={opponent.avatar}
                  alt={opponent.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users size={24} className="text-green-300" />
              )}
            </div>
            <p className="text-white font-medium">{opponent?.username}</p>
            <p className="text-green-300 font-bold text-xl">{opponentScore}</p>
          </div>
        </div>
        
        <div className="game-card p-4 mb-6">
          <h3 className="text-lg font-medium text-green-300 mb-2">Game Summary</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-left text-green-200/70">Correct Answers:</div>
            <div className="text-right text-white">{playerAnswers.filter(a => a.isCorrect).length} / {questions.length}</div>
            
            <div className="text-left text-green-200/70">Time to Complete:</div>
            <div className="text-right text-white">{results.timeToComplete}s</div>
            
            <div className="text-left text-green-200/70">XP Earned:</div>
            <div className="text-right text-white">+{results.xpEarned}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="game-button-small py-2 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Dashboard
          </button>
          
          <button 
            onClick={() => {
              setGameState('lobby');
              setRoomCode('');
              setJoinCode('');
              setOpponent(null);
              setQuestions([]);
              setCurrentQuestion(0);
              setSelectedAnswer(null);
              setPlayerScore(0);
              setOpponentScore(0);
              setPlayerAnswers([]);
              setOpponentAnswers([]);
              setResults(null);
            }}
            className="game-button py-2 flex items-center justify-center"
          >
            <Trophy size={16} className="mr-2" />
            Play Again
          </button>
        </div>
      </div>
    );
  };

  // Add a ConnectionError component for better error handling UI
  const ConnectionError = () => (
    <div className="min-h-screen bg-gradient-to-b from-red-900/80 via-red-800/80 to-red-900/80 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-black/50 backdrop-blur-xl border border-red-500/30 rounded-xl p-8 text-center">
        <div className="mb-6 inline-flex justify-center items-center w-16 h-16 rounded-full bg-red-900/50 border border-red-500/30">
          <AlertCircle className="w-8 h-8 text-red-300" />
        </div>
        
        <h2 className="text-2xl font-russo text-red-300 mb-4">Connection Error</h2>
        
        <p className="mb-6 text-white/80">
          Unable to connect to the game server. This could be because:
        </p>
        
        <ul className="text-left mb-8 space-y-2">
          <li className="flex items-start">
            <span className="mr-2 mt-0.5">•</span>
            <span>The server is currently offline or restarting</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 mt-0.5">•</span>
            <span>Your internet connection is interrupted</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 mt-0.5">•</span>
            <span>There is a temporary issue with the service</span>
          </li>
        </ul>
        
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-sm text-red-100">
            {errorMessage}
          </div>
        )}
        
        <div className="space-y-3">
          <button 
            onClick={() => {
              setConnectionStatus('connecting');
              if (socket) {
                socket.connect();
              } else {
                window.location.reload();
              }
            }}
            className="w-full py-3 bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg shadow-lg border border-red-500 transition-all"
          >
            Try Again
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-black/30 hover:bg-black/50 text-white font-bold rounded-lg shadow-md border border-white/20 transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 text-white relative overflow-hidden">
      <Particles className="absolute inset-0 z-0" quantity={30} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with back button */}
        {gameState !== 'results' && gameState !== 'waiting' && (
          <div className="mb-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-green-300 hover:text-green-200 transition-colors"
            >
              <ArrowLeft size={18} className="mr-1" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        )}
        
        {/* Connection Error */}
        {connectionStatus === 'error' && (
          <ConnectionError />
        )}
        
        {/* Connecting Status */}
        {connectionStatus === 'connecting' && (
          <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin mb-4 h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
              <h2 className="text-xl font-russo text-green-300">Connecting to Game Server...</h2>
              <p className="mt-2 text-white/70">This might take a few moments</p>
            </div>
          </div>
        )}
        
        {/* Game Screens - Only show when connected */}
        {connectionStatus === 'connected' && (
          <>
            {gameState === 'lobby' && renderLobby()}
            {gameState === 'waiting' && renderWaitingRoom()}
            {gameState === 'ready' && renderReadyScreen()}
            {gameState === 'playing' && renderGameplay()}
            {gameState === 'results' && renderResults()}
          </>
        )}
      </div>
    </div>
  );
}

export default CompetitiveMode; 