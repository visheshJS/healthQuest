import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Particles } from '../components/particles';
import { HeartPulse, User, Trophy, Heart, ArrowLeft, Home, Search, Pill } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateUserProgress } from '../utils/auth';

const DiagnosisDetective = () => {
  const [cases, setCases] = useState([]);
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [health, setHealth] = useState(5);
  const [score, setScore] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState('symptoms'); // symptoms, diagnosis, result
  const navigate = useNavigate();

  // Sample medical cases for diagnosis
  const medicalCases = [
    {
      id: 1,
      patientInfo: "25-year-old female athlete",
      presentingComplaint: "Sudden pain and swelling in right ankle after jumping during basketball game",
      availableSymptoms: [
        "Ankle pain", "Swelling", "Bruising", "Limited range of motion", 
        "Popping sound at time of injury", "Difficulty bearing weight",
        "Fever", "Numbness", "Previous similar injury"
      ],
      relevantSymptoms: [
        "Ankle pain", "Swelling", "Popping sound at time of injury", 
        "Difficulty bearing weight", "Limited range of motion"
      ],
      diagnosisOptions: [
        "Ankle Sprain", "Achilles Tendon Rupture", "Ankle Fracture", "Plantar Fasciitis"
      ],
      correctDiagnosis: "Ankle Sprain",
      explanation: "The sudden pain during activity, popping sound, swelling, and difficulty bearing weight without a history of direct trauma are classic signs of an ankle sprain, which is a stretching or tearing of ligaments."
    },
    {
      id: 2,
      patientInfo: "42-year-old male office worker",
      presentingComplaint: "Burning chest pain after meals and when lying down at night",
      availableSymptoms: [
        "Chest pain", "Burning sensation", "Pain worse when lying down", 
        "Bitter taste in mouth", "Cough", "Pain radiating to left arm",
        "Shortness of breath", "Nausea after meals", "Relief with antacids"
      ],
      relevantSymptoms: [
        "Chest pain", "Burning sensation", "Pain worse when lying down", 
        "Bitter taste in mouth", "Relief with antacids"
      ],
      diagnosisOptions: [
        "Gastroesophageal Reflux Disease (GERD)", "Myocardial Infarction", 
        "Pneumonia", "Pulmonary Embolism"
      ],
      correctDiagnosis: "Gastroesophageal Reflux Disease (GERD)",
      explanation: "The presence of burning chest pain, especially after meals and when lying down, bitter taste in mouth, and relief with antacids are classic symptoms of GERD, which is caused by stomach acid flowing back into the esophagus."
    },
    {
      id: 3,
      patientInfo: "58-year-old female with history of smoking",
      presentingComplaint: "Progressive shortness of breath over 6 months, worse with exertion",
      availableSymptoms: [
        "Shortness of breath", "Chronic cough", "Wheezing", 
        "Chest tightness", "Increased mucus production", "Fatigue", 
        "Recurrent respiratory infections", "Weight loss", "Ankle swelling"
      ],
      relevantSymptoms: [
        "Shortness of breath", "Chronic cough", "Wheezing", 
        "Increased mucus production", "Recurrent respiratory infections"
      ],
      diagnosisOptions: [
        "Chronic Obstructive Pulmonary Disease (COPD)", "Asthma", 
        "Pulmonary Fibrosis", "Congestive Heart Failure"
      ],
      correctDiagnosis: "Chronic Obstructive Pulmonary Disease (COPD)",
      explanation: "The combination of progressive shortness of breath, chronic cough, wheezing, increased mucus production, and history of smoking strongly suggests COPD, a progressive lung disease that causes obstructed airflow from the lungs."
    },
    {
      id: 4,
      patientInfo: "33-year-old female with no significant medical history",
      presentingComplaint: "Severe headache for 3 days, sensitivity to light",
      availableSymptoms: [
        "Severe headache", "Nausea", "Vomiting", "Sensitivity to light", 
        "Sensitivity to sound", "Visual disturbances", "Neck stiffness", 
        "Fever", "Confusion"
      ],
      relevantSymptoms: [
        "Severe headache", "Nausea", "Vomiting", "Sensitivity to light", 
        "Sensitivity to sound", "Visual disturbances"
      ],
      diagnosisOptions: [
        "Migraine", "Tension Headache", "Meningitis", "Brain Tumor"
      ],
      correctDiagnosis: "Migraine",
      explanation: "The presence of severe headache with associated symptoms of nausea, vomiting, photophobia (sensitivity to light), phonophobia (sensitivity to sound), and visual disturbances is characteristic of migraines. The absence of fever and neck stiffness makes meningitis less likely."
    },
    {
      id: 5,
      patientInfo: "65-year-old male with history of hypertension",
      presentingComplaint: "Sudden weakness and numbness in right arm and face, difficulty speaking",
      availableSymptoms: [
        "Facial drooping", "Arm weakness", "Slurred speech", "Confusion",
        "Sudden severe headache", "Loss of balance", "Vision changes",
        "Dizziness", "Loss of consciousness"
      ],
      relevantSymptoms: [
        "Facial drooping", "Arm weakness", "Slurred speech", "Confusion",
        "Vision changes"
      ],
      diagnosisOptions: [
        "Ischemic Stroke", "Transient Ischemic Attack", "Bell's Palsy", "Multiple Sclerosis"
      ],
      correctDiagnosis: "Ischemic Stroke",
      explanation: "The sudden onset of facial drooping, arm weakness, and slurred speech (FAST criteria) along with confusion and vision changes in a patient with hypertension strongly suggests an ischemic stroke, which occurs when a blood vessel supplying the brain is blocked."
    },
    {
      id: 6,
      patientInfo: "28-year-old male",
      presentingComplaint: "Painful, swollen right knee after football game yesterday",
      availableSymptoms: [
        "Knee pain", "Swelling", "Limited range of motion", "Catching sensation",
        "Locking of the joint", "Instability when walking", "Popping sound during injury",
        "Bruising", "Fever"
      ],
      relevantSymptoms: [
        "Knee pain", "Swelling", "Limited range of motion", "Catching sensation",
        "Instability when walking", "Popping sound during injury"
      ],
      diagnosisOptions: [
        "Meniscus Tear", "Anterior Cruciate Ligament (ACL) Tear", 
        "Patellar Dislocation", "Knee Bursitis"
      ],
      correctDiagnosis: "Meniscus Tear",
      explanation: "The combination of knee pain, swelling, catching sensations, and limited range of motion after a sports injury suggests a meniscus tear. The meniscus is cartilage that cushions the knee joint, and tears are common in twisting injuries during sports."
    },
    {
      id: 7,
      patientInfo: "50-year-old female with family history of autoimmune disorders",
      presentingComplaint: "Joint pain and stiffness in hands and feet, worse in the morning",
      availableSymptoms: [
        "Joint pain", "Morning stiffness lasting >1 hour", "Swollen joints",
        "Fatigue", "Low-grade fever", "Symmetric joint involvement",
        "Rheumatoid nodules", "Weight loss", "Muscle pain"
      ],
      relevantSymptoms: [
        "Joint pain", "Morning stiffness lasting >1 hour", "Swollen joints",
        "Fatigue", "Symmetric joint involvement", "Rheumatoid nodules"
      ],
      diagnosisOptions: [
        "Rheumatoid Arthritis", "Osteoarthritis", "Psoriatic Arthritis", "Fibromyalgia"
      ],
      correctDiagnosis: "Rheumatoid Arthritis",
      explanation: "The presence of symmetric joint pain and swelling, prolonged morning stiffness, fatigue, and rheumatoid nodules strongly suggests rheumatoid arthritis, a chronic inflammatory autoimmune disorder that affects the joints."
    },
    {
      id: 8,
      patientInfo: "45-year-old male with history of alcohol use",
      presentingComplaint: "Upper abdominal pain radiating to back, nausea, vomiting",
      availableSymptoms: [
        "Severe abdominal pain", "Pain radiating to back", "Nausea", "Vomiting",
        "Loss of appetite", "Fever", "Rapid pulse", "Tender abdomen",
        "Jaundice", "Recent alcohol consumption"
      ],
      relevantSymptoms: [
        "Severe abdominal pain", "Pain radiating to back", "Nausea", "Vomiting",
        "Tender abdomen", "Recent alcohol consumption"
      ],
      diagnosisOptions: [
        "Acute Pancreatitis", "Peptic Ulcer Disease", "Cholecystitis", "Appendicitis"
      ],
      correctDiagnosis: "Acute Pancreatitis",
      explanation: "The combination of severe upper abdominal pain radiating to the back, nausea, vomiting, and a history of alcohol use points to acute pancreatitis, which is inflammation of the pancreas often triggered by alcohol consumption or gallstones."
    },
    {
      id: 9,
      patientInfo: "19-year-old female college student",
      presentingComplaint: "Sore throat, fever, and extreme fatigue for 2 weeks",
      availableSymptoms: [
        "Sore throat", "Fever", "Fatigue", "Swollen lymph nodes in neck",
        "Enlarged spleen", "Rash", "Headache", "Loss of appetite",
        "Muscle aches", "Night sweats"
      ],
      relevantSymptoms: [
        "Sore throat", "Fever", "Fatigue", "Swollen lymph nodes in neck",
        "Enlarged spleen", "Headache"
      ],
      diagnosisOptions: [
        "Infectious Mononucleosis (Mono)", "Strep Throat", "Common Cold", "Influenza"
      ],
      correctDiagnosis: "Infectious Mononucleosis (Mono)",
      explanation: "The prolonged symptoms of sore throat, fever, extreme fatigue, swollen lymph nodes, and enlarged spleen in a young adult are classic features of infectious mononucleosis (mono), commonly caused by the Epstein-Barr virus (EBV)."
    },
    {
      id: 10,
      patientInfo: "37-year-old female with recent weight gain",
      presentingComplaint: "Fatigue, cold intolerance, and dry skin for several months",
      availableSymptoms: [
        "Fatigue", "Cold intolerance", "Dry skin", "Weight gain",
        "Hair loss", "Depression", "Constipation", "Muscle weakness",
        "Irregular menstrual periods", "Hoarse voice"
      ],
      relevantSymptoms: [
        "Fatigue", "Cold intolerance", "Dry skin", "Weight gain",
        "Hair loss", "Depression", "Constipation"
      ],
      diagnosisOptions: [
        "Hypothyroidism", "Depression", "Chronic Fatigue Syndrome", "Iron Deficiency Anemia"
      ],
      correctDiagnosis: "Hypothyroidism",
      explanation: "The constellation of symptoms including fatigue, cold intolerance, dry skin, weight gain, hair loss, depression, and constipation is consistent with hypothyroidism, a condition in which the thyroid gland doesn't produce enough thyroid hormone."
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // Shuffle the cases
      const shuffledCases = [...medicalCases].sort(() => Math.random() - 0.5);
      setCases(shuffledCases);
      setIsLoading(false);
    }, 1500);
  }, []);

  const currentCase = cases[currentCaseIndex];

  const handleSymptomToggle = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleDiagnosisSelect = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setIsRevealed(true);
    
    const isCorrect = diagnosis === currentCase.correctDiagnosis;
    
    if (isCorrect) {
      setScore(score + 1);
      toast.success('Correct diagnosis!');
    } else {
      setHealth(health - 1);
      toast.error('Incorrect diagnosis! Lost a life.');
    }
    
    // Calculate symptom accuracy
    const relevantCount = currentCase.relevantSymptoms.length;
    const correctlyIdentified = selectedSymptoms.filter(s => 
      currentCase.relevantSymptoms.includes(s)).length;
    const irrelevantSelected = selectedSymptoms.filter(s => 
      !currentCase.relevantSymptoms.includes(s)).length;
    
    // Bonus point for good symptom identification (at least 70% correct and less than 2 irrelevant)
    if (correctlyIdentified >= (relevantCount * 0.7) && irrelevantSelected < 2) {
      setScore(score => score + 1);
      toast.success('Bonus point for accurate symptom identification!');
    }
  };

  const handleNextCase = () => {
    setSelectedSymptoms([]);
    setSelectedDiagnosis(null);
    setIsRevealed(false);
    setStage('symptoms');
    
    // If we've reached the end or diagnosed 7 cases or health is depleted
    if (currentCaseIndex >= cases.length - 1 || currentCaseIndex >= 6 || health <= 0) {
      setShowResult(true);
      saveGameResult();
    } else {
      setCurrentCaseIndex(prev => prev + 1);
    }
  };

  const handleProceedToDiagnosis = () => {
    setStage('diagnosis');
  };

  const saveGameResult = async () => {
    // Calculate difficulty based on score and health
    let difficulty;
    if (score >= 800) {
      difficulty = 'hard';
    } else if (score >= 500) {
      difficulty = 'medium';
    } else {
      difficulty = 'easy';
    }
    
    // Check if completed without losing lives
    const noMistakes = health === 5;
    
    // Prepare data for user progress update
    const quizData = {
      type: 'Diagnosis Detective',
      difficulty,
      score: Math.min(100, Math.round((score / 1000) * 100)), // Convert to percentage capped at 100
      casesAttempted: currentCaseIndex + 1,
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

  const Header = () => (
    <div className="fixed top-0 left-0 right-0 bg-blue-900/95 backdrop-blur-md border-b border-blue-700/50 shadow-lg z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <HeartPulse className="w-7 h-7 text-blue-300" />
            <span className="text-2xl font-russo text-blue-300 tracking-wider">
              DIAGNOSIS<span className="text-white">DETECTIVE</span>
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
            <div className="flex items-center space-x-2 bg-blue-800/80 rounded-lg px-4 py-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{score}</span>
            </div>
            <Link to="/dashboard">
              <div className="flex items-center space-x-2 hover:bg-blue-800/80 rounded-lg px-4 py-2 transition-all duration-300">
                <Home className="w-5 h-5 text-blue-300" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={30}
        />
        <Header />
        <div className="flex items-center justify-center flex-grow">
          <div className="text-2xl text-blue-300 flex items-center">
            <HeartPulse className="w-8 h-8 text-blue-300 animate-pulse mr-3" />
            <span className="animate-pulse">Loading medical cases...</span>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={30}
        />
        <Header />
        <div className="flex flex-col items-center justify-center flex-grow p-6 pt-24">
          <div className="game-card p-8 shadow-2xl max-w-lg w-full text-center transform hover:scale-105 transition-all duration-300">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-4xl font-russo mb-6 text-blue-300">Medical Rotation Complete!</h2>
            <div className="space-y-4 mb-8">
              <p className="text-2xl text-white">Final Score: <span className="text-blue-300">{score}</span></p>
              <p className="text-xl text-white">Cases Completed: <span className="text-blue-300">{currentCaseIndex + 1}</span></p>
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
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
      <Particles
        className="absolute inset-0 -z-10"
        quantity={30}
      />
      <Header />
      <div className="flex flex-col items-center justify-center flex-grow p-6 pt-24">
        {/* Progress Bar */}
        <div className="w-full max-w-4xl mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-blue-300">Case {currentCaseIndex + 1} of {Math.min(cases.length, 7)}</span>
            <span className="text-sm text-blue-300">Score: {score}</span>
          </div>
          <div className="bg-blue-800/50 rounded-full h-3 shadow-lg p-0.5">
            <div
              className="bg-gradient-to-r from-blue-400 to-indigo-300 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentCaseIndex + 1) / Math.min(cases.length, 7)) * 100}%` }}
            />
          </div>
        </div>

        {/* Case Card */}
        <div className="w-full max-w-4xl">
          <div className="game-card p-8 mb-8 transform hover:scale-[1.01] transition-all duration-300">
            <div className="bg-blue-900/50 p-4 rounded-lg mb-6 border border-blue-700/50">
              <h3 className="text-lg text-blue-300 mb-2 font-semibold">Patient Information</h3>
              <p className="text-white mb-3">{currentCase?.patientInfo}</p>
              <h3 className="text-lg text-blue-300 mb-2 font-semibold">Presenting Complaint</h3>
              <p className="text-white">{currentCase?.presentingComplaint}</p>
            </div>

            {stage === 'symptoms' && (
              <>
                <h3 className="text-xl text-blue-300 mb-4 font-semibold flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Select Relevant Symptoms for Further Investigation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {currentCase?.availableSymptoms.map((symptom, index) => (
                    <button
                      key={index}
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`p-3 text-left rounded-lg text-base transition-all duration-300 transform hover:scale-[1.02] border ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-blue-600/50 border-blue-400/70 text-white'
                          : 'bg-blue-800/30 hover:bg-blue-700/30 border-blue-700/30 text-white'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleProceedToDiagnosis}
                    className="game-button"
                    disabled={selectedSymptoms.length === 0}
                  >
                    Proceed to Diagnosis
                  </button>
                </div>
              </>
            )}

            {stage === 'diagnosis' && (
              <>
                <div className="mb-6">
                  <h3 className="text-xl text-blue-300 mb-4 font-semibold flex items-center">
                    <Pill className="mr-2 h-5 w-5" />
                    Selected Symptoms for Investigation
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedSymptoms.map((symptom, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-700/40 text-white rounded-full border border-blue-600/50"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl text-blue-300 mb-4 font-semibold">Make Your Diagnosis</h3>
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {currentCase?.diagnosisOptions.map((diagnosis, index) => (
                    <button
                      key={index}
                      onClick={() => handleDiagnosisSelect(diagnosis)}
                      disabled={isRevealed}
                      className={`p-4 text-left rounded-lg text-lg transition-all duration-300 transform hover:scale-[1.02] border ${
                        isRevealed && diagnosis === currentCase.correctDiagnosis
                          ? 'bg-green-600/50 border-green-400/70 text-white'
                          : isRevealed && diagnosis === selectedDiagnosis && diagnosis !== currentCase.correctDiagnosis
                          ? 'bg-red-600/50 border-red-400/70 text-white'
                          : isRevealed
                          ? 'opacity-50 bg-blue-800/30 border-blue-700/30'
                          : 'bg-blue-800/50 hover:bg-blue-700/50 border-blue-700/30 text-white'
                      }`}
                    >
                      {diagnosis}
                    </button>
                  ))}
                </div>

                {isRevealed && (
                  <div className="mb-6">
                    <h3 className="text-xl text-blue-300 mb-2 font-semibold">Clinical Explanation</h3>
                    <div className="p-4 rounded-lg bg-blue-800/30 border border-blue-700/50">
                      <p className="text-white">{currentCase.explanation}</p>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-xl text-blue-300 mb-2 font-semibold">Relevant Symptoms</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentCase.relevantSymptoms.map((symptom, index) => (
                          <span 
                            key={index}
                            className={`px-3 py-1 rounded-full border ${
                              selectedSymptoms.includes(symptom)
                                ? 'bg-green-600/50 border-green-400/50 text-white'
                                : 'bg-yellow-600/50 border-yellow-400/50 text-white'
                            }`}
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={handleNextCase}
                        className="game-button"
                      >
                        Next Case
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisDetective; 