import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Particles } from '../components/particles';
import { Brain, Trophy, Heart, Timer, Home, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateUserProgress } from '../utils/auth';

const MedicalTrivia = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const navigate = useNavigate();

  // Array of medical trivia questions
  const triviaQuestions = [
    {
      question: "What is the largest organ in the human body?",
      options: ["Heart", "Liver", "Skin", "Brain"],
      correctAnswer: "Skin",
      explanation: "The skin is the largest organ in the human body, covering about 2 square meters in adults and making up about 15% of body weight.",
      difficulty: "easy"
    },
    {
      question: "Which vitamin is produced when your skin is exposed to sunlight?",
      options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
      correctAnswer: "Vitamin D",
      explanation: "Vitamin D is produced in the skin through a photosynthetic reaction triggered by exposure to UVB radiation from the sun.",
      difficulty: "easy"
    },
    {
      question: "Which of the following is NOT one of the four main blood types?",
      options: ["A", "AB", "O", "AO"],
      correctAnswer: "AO",
      explanation: "The four main blood types are A, B, AB, and O. AO is not a recognized blood type.",
      difficulty: "easy"
    },
    {
      question: "What is the normal resting heart rate for adults?",
      options: ["60-100 beats per minute", "40-60 beats per minute", "100-120 beats per minute", "120-160 beats per minute"],
      correctAnswer: "60-100 beats per minute",
      explanation: "A normal resting heart rate for adults ranges from 60 to 100 beats per minute, though well-trained athletes might have resting heart rates as low as 40.",
      difficulty: "easy"
    },
    {
      question: "Which of these is NOT a function of the liver?",
      options: ["Detoxification", "Protein synthesis", "Oxygenation of blood", "Bile production"],
      correctAnswer: "Oxygenation of blood",
      explanation: "Oxygenation of blood is primarily a function of the lungs, not the liver. The liver performs detoxification, protein synthesis, and bile production.",
      difficulty: "medium"
    },
    {
      question: "What is the name of the protein that makes blood red?",
      options: ["Myoglobin", "Hemoglobin", "Collagen", "Keratin"],
      correctAnswer: "Hemoglobin",
      explanation: "Hemoglobin is the iron-containing protein in red blood cells that gives blood its red color and transports oxygen throughout the body.",
      difficulty: "medium"
    },
    {
      question: "Which part of the brain is responsible for regulating basic bodily functions like breathing and heart rate?",
      options: ["Cerebrum", "Cerebellum", "Brainstem", "Corpus callosum"],
      correctAnswer: "Brainstem",
      explanation: "The brainstem connects the cerebrum with the spinal cord and controls many basic bodily functions, including breathing, heart rate, and blood pressure.",
      difficulty: "medium"
    },
    {
      question: "What is the most common type of white blood cell?",
      options: ["Neutrophils", "Lymphocytes", "Monocytes", "Eosinophils"],
      correctAnswer: "Neutrophils",
      explanation: "Neutrophils make up about 60-70% of white blood cells and are the first line of defense in the immune system, particularly against bacterial infections.",
      difficulty: "medium"
    },
    {
      question: "Which hormone regulates blood glucose levels by enabling cells to absorb glucose from the bloodstream?",
      options: ["Estrogen", "Testosterone", "Insulin", "Cortisol"],
      correctAnswer: "Insulin",
      explanation: "Insulin is produced by the pancreas and regulates blood glucose by enabling cells to absorb glucose from the bloodstream, lowering blood sugar levels.",
      difficulty: "medium"
    },
    {
      question: "What is the name of the procedure that uses sound waves to create images of structures inside the body?",
      options: ["X-ray", "MRI", "CT scan", "Ultrasound"],
      correctAnswer: "Ultrasound",
      explanation: "An ultrasound scan uses high-frequency sound waves to create images of the inside of the body, commonly used to monitor pregnancies and diagnose conditions.",
      difficulty: "medium"
    },
    {
      question: "What is the name of the valve between the left atrium and the left ventricle?",
      options: ["Tricuspid valve", "Mitral valve", "Aortic valve", "Pulmonary valve"],
      correctAnswer: "Mitral valve",
      explanation: "The mitral valve, also called the bicuspid valve, controls blood flow between the left atrium and the left ventricle of the heart.",
      difficulty: "hard"
    },
    {
      question: "Which of the following is NOT a neurotransmitter?",
      options: ["Dopamine", "Serotonin", "Insulin", "Acetylcholine"],
      correctAnswer: "Insulin",
      explanation: "Insulin is a hormone, not a neurotransmitter. Dopamine, serotonin, and acetylcholine are all neurotransmitters that transmit signals in the brain and nervous system.",
      difficulty: "hard"
    },
    {
      question: "Which part of the nephron reabsorbs the most water?",
      options: ["Proximal convoluted tubule", "Loop of Henle", "Distal convoluted tubule", "Collecting duct"],
      correctAnswer: "Proximal convoluted tubule",
      explanation: "The proximal convoluted tubule reabsorbs about 65% of the filtered water and sodium, making it the site of highest water reabsorption in the nephron.",
      difficulty: "hard"
    },
    {
      question: "What is the most abundant immunoglobulin in human serum?",
      options: ["IgA", "IgD", "IgE", "IgG"],
      correctAnswer: "IgG",
      explanation: "IgG is the most abundant immunoglobulin isotype, accounting for about 75-80% of antibodies in human serum and providing most antibody-based immunity against pathogens.",
      difficulty: "hard"
    },
    {
      question: "Which enzyme converts angiotensin I to angiotensin II?",
      options: ["Renin", "Angiotensin Converting Enzyme (ACE)", "Aldosterone synthase", "Pepsin"],
      correctAnswer: "Angiotensin Converting Enzyme (ACE)",
      explanation: "Angiotensin Converting Enzyme (ACE) catalyzes the conversion of angiotensin I to angiotensin II, a potent vasoconstrictor that increases blood pressure.",
      difficulty: "hard"
    },
    {
      question: "Which cranial nerve is responsible for taste sensation?",
      options: ["Facial nerve (VII)", "Vagus nerve (X)", "Glossopharyngeal nerve (IX)", "Both VII and IX"],
      correctAnswer: "Both VII and IX",
      explanation: "Both the facial nerve (VII) and the glossopharyngeal nerve (IX) are responsible for taste sensation. The facial nerve handles the anterior two-thirds of the tongue, while the glossopharyngeal nerve handles the posterior third.",
      difficulty: "hard"
    },
    {
      question: "Which of the following is the correct sequence of the cardiac conduction system?",
      options: [
        "SA node → AV node → Bundle of His → Purkinje fibers",
        "AV node → SA node → Purkinje fibers → Bundle of His",
        "Bundle of His → SA node → AV node → Purkinje fibers",
        "Purkinje fibers → Bundle of His → SA node → AV node"
      ],
      correctAnswer: "SA node → AV node → Bundle of His → Purkinje fibers",
      explanation: "The electrical impulse starts at the sinoatrial (SA) node, travels to the atrioventricular (AV) node, then through the Bundle of His, and finally to the Purkinje fibers, which stimulate contraction of the ventricles.",
      difficulty: "hard"
    },
    {
      question: "What is the function of surfactant in the lungs?",
      options: [
        "To prevent the lungs from collapsing by reducing surface tension",
        "To increase the surface tension in alveoli",
        "To help remove carbon dioxide from the blood",
        "To fight against respiratory infections"
      ],
      correctAnswer: "To prevent the lungs from collapsing by reducing surface tension",
      explanation: "Surfactant reduces surface tension in the alveoli, preventing lung collapse (atelectasis) and making it easier to inflate the lungs, especially during exhalation.",
      difficulty: "hard"
    }
  ];

  useEffect(() => {
    initializeGame(difficultyLevel);
  }, [difficultyLevel]);

  useEffect(() => {
    let timer;
    if (!isLoading && !showAnswer && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLoading, showAnswer, currentQuestionIndex, gameOver]);

  const initializeGame = (difficulty) => {
    setIsLoading(true);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setGameOver(false);

    let filteredQuestions;
    if (difficulty === 'mixed') {
      filteredQuestions = [...triviaQuestions];
    } else {
      filteredQuestions = triviaQuestions.filter(q => q.difficulty === difficulty);
    }

    // Shuffle questions and limit to maxQuestions
    const shuffledQuestions = [...filteredQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, maxQuestions);

    // Simulate loading
    setTimeout(() => {
      setQuestions(shuffledQuestions);
      setTimeLeft(30);
      setIsLoading(false);
    }, 1500);
  };

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;
    setSelectedAnswer(answer);
  };

  const handleTimeout = () => {
    setShowAnswer(true);
    toast.error('Time\'s up!');
  };

  const handleNextQuestion = async () => {
    // If current question was the last one, end game
    if (currentQuestionIndex >= questions.length - 1) {
      await saveGameResult();
      setGameOver(true);
      return;
    }

    // Otherwise, move to next question
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setTimeLeft(30);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) {
      toast.error('Please select an answer first!');
      return;
    }

    setShowAnswer(true);
    const currentQuestion = questions[currentQuestionIndex];
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + calculateScore());
      toast.success('Correct!');
    } else {
      toast.error('Incorrect!');
    }
  };

  const calculateScore = () => {
    // Base score is 100, with bonus for time left
    return 100 + (timeLeft * 3);
  };

  const saveGameResult = async () => {
    // Calculate how many correct answers based on score
    const correctAnswers = Math.round(score / 100);
    
    // Check if completed without mistakes
    const noMistakes = correctAnswers === questions.length;
    
    // Prepare data for user progress update
    const quizData = {
      type: 'Medical Trivia',
      difficulty: difficultyLevel,
      score: Math.round((score / (questions.length * 100)) * 100), // Convert to percentage
      correctAnswers,
      questionsAnswered: currentQuestionIndex + 1,
      noMistakes,
      timestamp: new Date()
    };
    
    // Update user progress in localStorage and handle achievements
    const result = await updateUserProgress(quizData);
    
    if (result && result.success) {
      // Show earned XP toast
      toast.success(`+${result.earnedXP} XP earned!`);
      
      // Show level up toast if applicable
      if (result.newLevel) {
        toast.success(`🎉 Level up! You're now level ${result.user.level}!`, {
          duration: 5000,
          icon: '🏆'
        });
      }
      
      // Show new achievements if any
      if (result.newAchievements && result.newAchievements.length > 0) {
        setTimeout(() => {
          result.newAchievements.forEach(achievement => {
            toast.success(`🏅 Achievement unlocked: ${achievement.name}!`, {
              duration: 5000,
              icon: '🏅'
            });
          });
        }, 1000);
      }
    }
    
    console.log('Game result saved:', quizData);
  };

  const formatTime = (seconds) => {
    return seconds.toString().padStart(2, '0');
  };

  const difficultyToColor = {
    easy: 'bg-green-600',
    medium: 'bg-yellow-600',
    hard: 'bg-red-600',
    mixed: 'bg-purple-600'
  };

  const Header = () => (
    <div className="fixed top-0 left-0 right-0 bg-teal-900/95 backdrop-blur-md border-b border-teal-700/50 shadow-lg z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-teal-300" />
            <span className="text-xl sm:text-2xl font-russo text-teal-300 tracking-wider">
              MEDICAL<span className="text-white">TRIVIA</span>
            </span>
          </Link>
          {!isLoading && !gameOver && (
            <div className="flex items-center space-x-1 sm:space-x-3">
              <div className="flex items-center space-x-1 sm:space-x-2 bg-teal-800/80 rounded-lg px-2 sm:px-4 py-1 sm:py-2">
                <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300" />
                <span className="text-white font-mono text-sm sm:text-xl">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 bg-teal-800/80 rounded-lg px-2 sm:px-4 py-1 sm:py-2">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300" />
                <span className="text-white text-sm sm:text-base font-bold">{score}</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 bg-teal-800/80 rounded-lg px-2 sm:px-3 py-1 sm:py-2">
                <span className="text-white text-xs sm:text-base font-bold">{currentQuestionIndex + 1}/{questions.length}</span>
              </div>
              <Link to="/dashboard">
                <div className="flex items-center space-x-1 sm:space-x-2 hover:bg-teal-800/80 rounded-lg px-2 sm:px-4 py-1 sm:py-2 transition-all duration-300">
                  <Home className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-emerald-900 overflow-hidden">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={30}
        />
        <Header />
        <div className="flex items-center justify-center flex-grow p-4">
          <div className="text-lg sm:text-2xl text-teal-300 flex flex-col sm:flex-row items-center">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-teal-300 animate-pulse mb-2 sm:mb-0 sm:mr-3" />
            <span className="animate-pulse text-center">Loading trivia questions...</span>
          </div>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-emerald-900 overflow-hidden">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={30}
        />
        <Header />
        <div className="flex flex-col items-center justify-center flex-grow p-4 sm:p-6 pt-20 sm:pt-24">
          <div className="game-card p-4 sm:p-8 shadow-2xl max-w-lg w-full text-center transform hover:scale-105 transition-all duration-300">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-2xl sm:text-4xl font-russo mb-4 sm:mb-6 text-teal-300">Trivia Complete!</h2>
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <p className="text-xl sm:text-2xl text-white">Final Score: <span className="text-teal-300">{score}</span></p>
              <p className="text-base sm:text-xl text-white">Questions: <span className="text-teal-300">{currentQuestionIndex + 1}/{questions.length}</span></p>
              <p className="text-base sm:text-xl text-white">Correct Answers: <span className="text-teal-300">~{Math.round(score / 100)}</span></p>
              
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-teal-800/50 rounded-lg">
                <p className="text-base sm:text-lg text-white">Performance: <span className="text-yellow-400 font-bold text-lg sm:text-xl">
                  {score >= 800 ? 'Medical Expert!' :
                    score >= 600 ? 'Medical Professional!' :
                    score >= 400 ? 'Medical Student!' : 'Medical Novice'}
                </span></p>
                <p className="text-xs sm:text-sm text-teal-300">
                  {score >= 800 ? 'Your knowledge is exceptional!' :
                    score >= 600 ? 'Very impressive knowledge!' :
                    score >= 400 ? 'Good foundation of knowledge!' : 'Keep learning and you\'ll improve!'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                <button 
                  onClick={() => {
                    setDifficultyLevel('easy');
                  }}
                  className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition ${
                    difficultyLevel === 'easy' ? 'bg-green-600 text-white' : 'bg-teal-800/70 text-teal-300 hover:bg-teal-700/70'
                  }`}
                >
                  Easy
                </button>
                <button 
                  onClick={() => {
                    setDifficultyLevel('medium');
                  }}
                  className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition ${
                    difficultyLevel === 'medium' ? 'bg-yellow-600 text-white' : 'bg-teal-800/70 text-teal-300 hover:bg-teal-700/70'
                  }`}
                >
                  Medium
                </button>
                <button 
                  onClick={() => {
                    setDifficultyLevel('hard');
                  }}
                  className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition ${
                    difficultyLevel === 'hard' ? 'bg-red-600 text-white' : 'bg-teal-800/70 text-teal-300 hover:bg-teal-700/70'
                  }`}
                >
                  Hard
                </button>
                <button 
                  onClick={() => {
                    setDifficultyLevel('mixed');
                  }}
                  className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition ${
                    difficultyLevel === 'mixed' ? 'bg-purple-600 text-white' : 'bg-teal-800/70 text-teal-300 hover:bg-teal-700/70'
                  }`}
                >
                  Mixed
                </button>
              </div>
              
              <button 
                onClick={() => initializeGame(difficultyLevel)}
                className="game-button w-full py-2 text-sm sm:text-base bg-teal-600 hover:bg-teal-700"
              >
                Play Again
              </button>
              
              <button 
                onClick={() => navigate('/dashboard')}
                className="game-button w-full py-2 text-sm sm:text-base"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-emerald-900 overflow-hidden">
      <Particles
        className="absolute inset-0 -z-10"
        quantity={30}
      />
      <Header />
      <div className="flex flex-col items-center justify-center flex-grow p-4 sm:p-6 pt-20 sm:pt-24">
        <div className="w-full max-w-4xl">
          <div className="mb-4 sm:mb-8">
            <div className="flex justify-between items-center mb-2">
              <div className={`px-2 sm:px-3 py-1 rounded-md ${difficultyToColor[currentQuestion.difficulty] || 'bg-teal-800'} text-white text-xs sm:text-sm`}>
                {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </div>
              <div className="bg-teal-800/50 rounded-lg px-2 sm:px-4 py-1">
                <p className="text-xs sm:text-sm text-teal-300">Question <span className="text-white font-bold">{currentQuestionIndex + 1}/{questions.length}</span></p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-teal-800/50 rounded-full h-2 sm:h-2.5 mb-4 sm:mb-6">
              <div 
                className="bg-teal-500 h-2 sm:h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
              ></div>
            </div>
            
            {/* Question Card */}
            <div className="game-card p-4 sm:p-6 md:p-8 shadow-xl mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-4 sm:mb-6">{currentQuestion.question}</h2>
              
              <div className="space-y-2 sm:space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showAnswer}
                    className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                      showAnswer
                        ? option === currentQuestion.correctAnswer
                          ? 'bg-green-600 text-white'
                          : selectedAnswer === option
                            ? 'bg-red-600 text-white'
                            : 'bg-teal-800/60 text-teal-200'
                        : selectedAnswer === option
                          ? 'bg-teal-600 text-white'
                          : 'bg-teal-800/60 text-teal-200 hover:bg-teal-700/60'
                    }`}
                  >
                    <div className="flex items-center">
                      {option}
                    </div>
                  </button>
                ))}
              </div>
              
              {showAnswer && (
                <div className="mt-6 p-4 bg-teal-800/30 border border-teal-700/50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-teal-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-teal-300 mb-1">Explanation:</h4>
                      <p className="text-teal-200">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                {!showAnswer ? (
                  <button 
                    onClick={handleCheckAnswer}
                    className="game-button bg-teal-600 hover:bg-teal-700"
                    disabled={!selectedAnswer}
                  >
                    Check Answer
                  </button>
                ) : (
                  <button 
                    onClick={handleNextQuestion}
                    className="game-button bg-teal-600 hover:bg-teal-700 flex items-center"
                  >
                    {currentQuestionIndex >= questions.length - 1 ? 'See Results' : 'Next Question'}
                    <ChevronRight className="ml-1 w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalTrivia; 