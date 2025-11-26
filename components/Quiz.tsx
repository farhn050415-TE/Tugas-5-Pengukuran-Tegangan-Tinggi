import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { generateQuizHint } from '../services/geminiService';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Faktor apa yang paling berpengaruh pada tegangan tembus sela bola selain jarak sela?",
    options: ["Warna bola", "Kerapatan Udara (Suhu & Tekanan)", "Arus bocor", "Material penyangga"],
    correctAnswer: 1,
    explanation: "Sesuai Hukum Paschen, tegangan tembus gas adalah fungsi dari produk tekanan dan jarak (p x d). Kerapatan udara berubah seiring suhu dan tekanan."
  },
  {
    id: 2,
    question: "Mengapa pembagi tegangan resistif kurang cocok untuk mengukur tegangan impuls frekuensi tinggi?",
    options: ["Karena resistornya terlalu mahal", "Karena efek induktansi parasitik dan kapasitansi nyasar (stray capacitance)", "Karena resistor akan meleleh", "Karena tegangannya terlalu rendah"],
    correctAnswer: 1,
    explanation: "Pada frekuensi tinggi, kapasitansi stray (nyasar) ke tanah akan mendistorsi pembagian tegangan pada resistor murni, menyebabkan kesalahan pengukuran."
  },
  {
    id: 3,
    question: "Pada pembagi kapasitif, jika C2 (Low Voltage) jauh lebih besar dari C1 (High Voltage), maka tegangan output akan?",
    options: ["Sangat kecil dibanding input", "Sama dengan input", "Lebih besar dari input", "Menjadi nol"],
    correctAnswer: 0,
    explanation: "Vout = Vin * (C1 / (C1+C2)). Jika C2 >> C1, maka pembilangnya kecil, sehingga Vout menjadi fraksi kecil dari Vin (aman untuk alat ukur)."
  }
];

const Quiz: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  const currentQuestion = QUESTIONS[currentQIndex];

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    setShowResult(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    setHint(null);
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(c => c + 1);
    } else {
      // End of quiz logic could go here
      alert(`Kuis Selesai! Skor Anda: ${score + (selectedOption === currentQuestion.correctAnswer ? 0 : 0)} / ${QUESTIONS.length}`);
      setCurrentQIndex(0);
      setScore(0);
    }
  };

  const handleGetHint = async () => {
    setLoadingHint(true);
    const hintText = await generateQuizHint(currentQuestion.question);
    setHint(hintText);
    setLoadingHint(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentQIndex + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">
              Pertanyaan {currentQIndex + 1} dari {QUESTIONS.length}
            </span>
            <span className="text-slate-400 text-sm">Skor: {score}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group ${
                  showResult 
                    ? idx === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : idx === selectedOption
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-slate-100 text-slate-400'
                    : selectedOption === idx
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span>{option}</span>
                {showResult && idx === currentQuestion.correctAnswer && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {showResult && idx === selectedOption && idx !== currentQuestion.correctAnswer && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Hint Area */}
          {!showResult && (
             <div className="mt-6 flex justify-center">
               {hint ? (
                 <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-sm border border-amber-200 w-full animate-in fade-in">
                   <span className="font-bold">Bantuan AI:</span> {hint}
                 </div>
               ) : (
                 <button 
                  onClick={handleGetHint} 
                  disabled={loadingHint}
                  className="text-amber-600 text-sm font-medium hover:text-amber-700 flex items-center gap-1 disabled:opacity-50"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   {loadingHint ? "Sedang memuat..." : "Butuh Petunjuk? Tanya AI"}
                 </button>
               )}
             </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-blue-200 shadow-lg"
              >
                Cek Jawaban
              </button>
            ) : (
              <div className="w-full">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                  <h4 className="font-bold text-slate-800 mb-1">Penjelasan:</h4>
                  <p className="text-slate-600 text-sm">{currentQuestion.explanation}</p>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-900 transition-colors"
                >
                  {currentQIndex < QUESTIONS.length - 1 ? "Pertanyaan Selanjutnya" : "Selesai"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;