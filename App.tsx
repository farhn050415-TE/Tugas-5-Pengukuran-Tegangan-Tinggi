import React, { useState } from 'react';
import { AppView } from './types';
import Material from './components/Material';
import Simulator from './components/Simulator';
import Quiz from './components/Quiz';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [history, setHistory] = useState<AppView[]>([]);

  const handleNavigate = (view: AppView) => {
    if (view === currentView) return;
    setHistory((prev) => [...prev, currentView]);
    setCurrentView(view);
    window.scrollTo(0, 0); // Reset scroll to top on navigation
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevView = newHistory.pop();
    setHistory(newHistory);
    if (prevView) {
      setCurrentView(prevView);
      window.scrollTo(0, 0);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.MATERIAL:
        return <Material />;
      case AppView.SIMULATOR:
        return <Simulator />;
      case AppView.QUIZ:
        return <Quiz />;
      case AppView.HOME:
      default:
        return (
          <div className="space-y-12 py-12 animate-in fade-in duration-700">
            {/* Group Members Section - Moved to Top */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center border-b border-slate-100 pb-4">
                Anggota Kelompok 2
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {[
                  { name: "Muhammad Fadli", nim: "2310952007" },
                  { name: "Farhan Hamid", nim: "2310951007" },
                  { name: "Dzakwan Zodi Ismail", nim: "2310951021" },
                  { name: "Aby Pranada", nim: "2310952040" },
                  { name: "Musaddad", nim: "2310952064" },
                ].map((student, idx) => (
                  <li key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{student.name}</p>
                      <p className="text-sm text-slate-500 font-mono">{student.nim}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hero Section */}
            <div className="text-center space-y-8">
              <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                Virtual Lab <span className="text-blue-600">Tegangan Tinggi</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Pelajari, simulasikan, dan uji pemahaman Anda tentang teknik pengukuran tegangan tinggi. 
                Dilengkapi dengan simulator interaktif Selah Bola, Pembagi Resistif, dan Kapasitif.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button 
                  onClick={() => handleNavigate(AppView.SIMULATOR)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-transform hover:-translate-y-1 shadow-lg shadow-blue-200"
                >
                  Mulai Simulasi
                </button>
                <button 
                  onClick={() => handleNavigate(AppView.MATERIAL)}
                  className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors"
                >
                  Pelajari Materi
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 bg-opacity-90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              {history.length > 0 && (
                <button 
                  onClick={handleBack}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-2 group"
                  title="Kembali ke halaman sebelumnya"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                   </svg>
                   <span className="hidden sm:inline text-sm font-medium">Kembali</span>
                </button>
              )}

              {/* Logo */}
              <div className="flex items-center cursor-pointer" onClick={() => handleNavigate(AppView.HOME)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                  HV-Lab
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-4">
              {[
                { label: 'Materi', view: AppView.MATERIAL },
                { label: 'Simulator', view: AppView.SIMULATOR },
                { label: 'Kuis', view: AppView.QUIZ },
              ].map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavigate(item.view)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === item.view 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2024 HV-Lab Engineering Physics. Powered by React, Tailwind & Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;