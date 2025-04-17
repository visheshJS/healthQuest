import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, User, Trophy } from 'lucide-react';
import { Particles } from './particles';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [health, setHealth] = useState(5);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const mcqResponse = await fetch('/data/mcq.json');
        const symptomsResponse = await fetch('/data/symptoms.json');
        
        const mcqData = await mcqResponse.json();
        const symptomsData = await symptomsResponse.json();

        // Transform symptoms data to match MCQ format
        const transformedSymptomsData = symptomsData.map(q => ({
          ...q,
          question: q.case // Map 'case' to 'question' for consistency
        }));

        // Combine and shuffle questions
        const allQuestions = [...mcqData, ...transformedSymptomsData].sort(() => Math.random() - 0.5);
        setQuestions(allQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };

    loadQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    if (selectedOption !== null) return; // Prevent multiple selections
    setSelectedOption(option);
    const correct = option === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    } else {
      setHealth(health - 1);
    }

    setTimeout(() => {
      if (health > 1 || correct) {
        handleNextQuestion();
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleSkip = () => {
    setHealth(health - 1);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const getOptionStyle = (option) => {
    if (selectedOption === null) return '';
    if (option === currentQuestion.answer) return 'bg-green-500';
    if (option === selectedOption) return 'bg-red-500';
    return 'opacity-50';
  };

  const Header = () => (
    <div className="fixed top-0 left-0 right-0 bg-[#1B4332]/95 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-[#95D5B2]" />
            <span className="text-2xl font-bold text-white">HealthQuest</span>
          </Link>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-[#2D6A4F] rounded-lg px-4 py-2">
              <Trophy className="w-5 h-5 text-[#95D5B2]" />
              <span className="text-white font-bold">{score}</span>
            </div>
            <Link to="/dashboard">
              <div className="flex items-center space-x-2 hover:bg-[#2D6A4F] rounded-lg px-4 py-2 transition-all duration-300">
                <User className="w-5 h-5 text-[#95D5B2]" />
                <span className="text-white">Profile</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (!currentQuestion) {
    return (
      <div className="relative flex flex-col min-h-screen bg-[#081C15] overflow-hidden">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={50}
          staticity={30}
          ease={70}
        />
        <Header />
        <div className="flex items-center justify-center flex-grow">
          <div className="text-2xl text-white animate-pulse">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="relative flex flex-col min-h-screen bg-[#081C15] overflow-hidden">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={50}
          staticity={30}
          ease={70}
        />
        <Header />
        <div className="flex flex-col items-center justify-center flex-grow p-6">
          <div className="bg-[#1B4332]/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-lg w-full text-center transform hover:scale-105 transition-all duration-300">
            <Trophy className="w-16 h-16 text-[#95D5B2] mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-6 text-white">Quiz Complete!</h2>
            <div className="space-y-4 mb-8">
              <p className="text-2xl text-[#95D5B2]">Final Score: {score}</p>
              <p className="text-xl text-[#95D5B2]">Health Remaining: {health}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#2D6A4F] hover:bg-[#40916C] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-[#081C15] overflow-hidden">
      <Particles
        className="absolute inset-0 -z-10"
        quantity={50}
        staticity={30}
        ease={70}
      />
      <Header />
      <div className="flex flex-col items-center justify-center flex-grow p-6 mt-16">
        {/* Health and Progress Bar */}
        <div className="w-full max-w-3xl mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center bg-[#1B4332]/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <span className="mr-3 text-2xl">❤️</span>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full mx-1 transition-all duration-300 transform ${
                    i < health ? 'bg-red-500 scale-110' : 'bg-gray-500 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="bg-[#1B4332]/90 backdrop-blur-sm rounded-full h-3 shadow-lg p-0.5">
            <div
              className="bg-[#95D5B2] h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="w-full max-w-3xl bg-[#1B4332]/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl mb-8 transform hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-2xl font-bold mb-8 text-white">{currentQuestion.question || currentQuestion.case}</h2>
          <div className="grid gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`p-5 text-left rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedOption === null
                    ? 'bg-[#2D6A4F]/90 hover:bg-[#40916C] text-white backdrop-blur-sm'
                    : getOptionStyle(option)
                } ${
                  selectedOption === option ? 'ring-4 ring-white' : ''
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          disabled={selectedOption !== null}
          className={`px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
            selectedOption === null
              ? 'bg-[#2D6A4F]/90 hover:bg-[#40916C] text-white backdrop-blur-sm'
              : 'bg-gray-500/90 cursor-not-allowed text-gray-300 backdrop-blur-sm'
          }`}
        >
          Skip Question
        </button>
      </div>
    </div>
  );
};

export default Quiz; 