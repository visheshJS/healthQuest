import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Particles } from '../components/particles';
import { Brain, User, Trophy, Heart, ArrowLeft, Home } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateUserProgress } from '../utils/auth';

const AnatomyQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [health, setHealth] = useState(5);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Sample anatomy questions
  const anatomyQuestions = [
    {
      question: "Which of these structures is part of the limbic system?",
      options: ["Cerebellum", "Amygdala", "Pons", "Medulla oblongata"],
      answer: "Amygdala",
      explanation: "The amygdala is part of the limbic system and is involved in emotion processing, especially fear responses."
    },
    {
      question: "Which of the following is NOT a structure in the brain stem?",
      options: ["Pons", "Midbrain", "Hippocampus", "Medulla oblongata"],
      answer: "Hippocampus",
      explanation: "The hippocampus is part of the limbic system, not the brain stem. The brain stem consists of the midbrain, pons, and medulla oblongata."
    },
    {
      question: "Which heart valve separates the left atrium from the left ventricle?",
      options: ["Tricuspid valve", "Pulmonary valve", "Mitral valve", "Aortic valve"],
      answer: "Mitral valve",
      explanation: "The mitral (bicuspid) valve separates the left atrium from the left ventricle."
    },
    {
      question: "Which of the following is the largest artery in the human body?",
      options: ["Carotid artery", "Femoral artery", "Aorta", "Pulmonary artery"],
      answer: "Aorta",
      explanation: "The aorta is the largest artery in the human body, carrying oxygenated blood from the left ventricle to the rest of the body."
    },
    {
      question: "Which of the following is NOT a part of the small intestine?",
      options: ["Duodenum", "Jejunum", "Ileum", "Cecum"],
      answer: "Cecum",
      explanation: "The cecum is the first part of the large intestine. The small intestine consists of the duodenum, jejunum, and ileum."
    },
    {
      question: "Which of the following bones is NOT part of the axial skeleton?",
      options: ["Ribs", "Vertebrae", "Humerus", "Skull"],
      answer: "Humerus",
      explanation: "The humerus is part of the appendicular skeleton (limbs). The axial skeleton includes the skull, vertebral column, ribs, and sternum."
    },
    {
      question: "Which structure connects muscle to bone?",
      options: ["Ligament", "Tendon", "Fascia", "Cartilage"],
      answer: "Tendon",
      explanation: "Tendons connect muscles to bones, while ligaments connect bones to other bones."
    },
    {
      question: "Which of the following is NOT a function of the liver?",
      options: ["Detoxification", "Protein synthesis", "Bile production", "Insulin production"],
      answer: "Insulin production",
      explanation: "Insulin is produced by the pancreas, not the liver. The liver is involved in detoxification, protein synthesis, and bile production."
    },
    {
      question: "Which part of the nephron is responsible for blood filtration?",
      options: ["Glomerulus", "Loop of Henle", "Collecting duct", "Distal convoluted tubule"],
      answer: "Glomerulus",
      explanation: "The glomerulus is the site of blood filtration in the nephron of the kidney."
    },
    {
      question: "Which of the following is NOT a layer of the heart wall?",
      options: ["Epicardium", "Myocardium", "Endocardium", "Pericardium"],
      answer: "Pericardium",
      explanation: "The pericardium is a membrane surrounding the heart, not a layer of the heart wall itself. The heart wall consists of epicardium (outer), myocardium (middle), and endocardium (inner)."
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // Shuffle the questions
      const shuffledQuestions = [...anatomyQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
      setIsLoading(false);
    }, 1500);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    if (selectedOption !== null) return; // Prevent multiple selections
    setSelectedOption(option);
    const correct = option === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      toast.success('Correct answer!');
    } else {
      setHealth(health - 1);
      toast.error('Incorrect! Lost a life.');
    }

    // Wait before moving to next question or showing result
    setTimeout(() => {
      if (health > 1 || correct) {
        handleNextQuestion();
      } else {
        setShowResult(true);
        // Save the game result to local storage for recent activity
        saveGameResult();
      }
    }, 2000);
  };

  const handleSkip = () => {
    if (selectedOption !== null) return; // Prevent skipping during feedback
    setHealth(health - 1);
    toast.warning('Question skipped! Lost a life.');
    setTimeout(() => {
      if (health > 1) {
        handleNextQuestion();
      } else {
        setShowResult(true);
        saveGameResult();
      }
    }, 1000);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    
    // If we've reached the end or answered 10 questions
    if (currentQuestionIndex >= questions.length - 1 || currentQuestionIndex >= 9) {
      setShowResult(true);
      saveGameResult();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const saveGameResult = async () => {
    // Calculate percentage
    const percentage = currentQuestionIndex > 0 
      ? Math.round((score / (currentQuestionIndex + 1)) * 100) 
      : 0;
    
    // Determine difficulty based on percentage
    let difficulty;
    if (percentage >= 80) {
      difficulty = 'hard';
    } else if (percentage >= 60) {
      difficulty = 'medium';
    } else {
      difficulty = 'easy';
    }
    
    // Check if completed without losing lives
    const noMistakes = health === 5;
    
    // Prepare data for user progress update
    const quizData = {
      type: 'Anatomy Quiz',
      difficulty,
      score: percentage,
      questionsAttempted: currentQuestionIndex + 1,
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

  const getOptionStyle = (option) => {
    if (selectedOption === null) return '';
    if (option === currentQuestion.answer) return 'bg-green-500/80 border-green-400';
    if (option === selectedOption && option !== currentQuestion.answer) return 'bg-red-500/80 border-red-400';
    return 'opacity-50';
  };

  const Header = () => (
    <div className="fixed top-0 left-0 right-0 bg-green-900/95 backdrop-blur-md border-b border-green-700/50 shadow-lg z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <Heart className="w-7 h-7 text-green-300" />
            <span className="text-2xl font-russo text-green-300 tracking-wider">
              ANATOMY<span className="text-white">QUEST</span>
            </span>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full transition-all duration-300 transform ${
                    i < health ? 'bg-red-500 scale-100' : 'bg-red-900/40 scale-90'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center space-x-2 bg-green-800/80 rounded-lg px-4 py-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{score}</span>
            </div>
            <Link to="/dashboard">
              <div className="flex items-center space-x-2 hover:bg-green-800/80 rounded-lg px-4 py-2 transition-all duration-300">
                <Home className="w-5 h-5 text-green-300" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 overflow-hidden">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={30}
        />
        <Header />
        <div className="flex items-center justify-center flex-grow">
          <div className="text-2xl text-green-300 flex items-center">
            <Heart className="w-8 h-8 text-green-300 animate-pulse mr-3" />
            <span className="animate-pulse">Loading anatomy questions...</span>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    // Calculate percentage
    const percentage = currentQuestionIndex > 0 
      ? Math.round((score / (currentQuestionIndex + 1)) * 100) 
      : 0;
    
    return (
      <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 overflow-hidden">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={30}
        />
        <Header />
        <div className="flex flex-col items-center justify-center flex-grow p-6 pt-24">
          <div className="game-card p-8 shadow-2xl max-w-lg w-full text-center transform hover:scale-105 transition-all duration-300">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-4xl font-russo mb-6 text-green-300">Quiz Complete!</h2>
            <div className="space-y-4 mb-8">
              <p className="text-2xl text-white">Final Score: <span className="text-green-300">{score}/{currentQuestionIndex + 1}</span></p>
              <div className="w-full bg-green-900/50 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-300 h-4 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-xl text-white">Accuracy: <span className="text-green-300">{percentage}%</span></p>
              <p className="text-xl text-white">Health Remaining: <span className="text-red-400">{health}</span></p>
            </div>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="game-button"
              >
                Play Again
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="game-button"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 overflow-hidden">
      <Particles
        className="absolute inset-0 -z-10"
        quantity={30}
      />
      <Header />
      <div className="flex flex-col items-center justify-center flex-grow p-6 pt-24">
        {/* Progress Bar */}
        <div className="w-full max-w-3xl mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-green-300">Question {currentQuestionIndex + 1} of {Math.min(questions.length, 10)}</span>
            <span className="text-sm text-green-300">Score: {score}</span>
          </div>
          <div className="bg-green-800/50 rounded-full h-3 shadow-lg p-0.5">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-300 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / Math.min(questions.length, 10)) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="w-full max-w-3xl game-card p-8 mb-8 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-2xl font-russo mb-8 text-green-300">{currentQuestion?.question}</h2>
          <div className="grid gap-4">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`p-4 text-left rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] border ${
                  selectedOption === null
                    ? 'bg-green-800/50 hover:bg-green-700/50 border-green-600/30 text-white'
                    : getOptionStyle(option)
                } ${
                  selectedOption === option ? 'ring-2 ring-white' : ''
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Explanation for answered questions */}
          {selectedOption && (
            <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-600/20 border border-green-500/30' : 'bg-red-600/20 border border-red-500/30'}`}>
              <p className="text-white">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        {/* Skip Button */}
        {!selectedOption && (
          <button
            onClick={handleSkip}
            className="game-button-small py-3 px-6"
          >
            Skip Question
          </button>
        )}
      </div>
    </div>
  );
};

export default AnatomyQuiz; 