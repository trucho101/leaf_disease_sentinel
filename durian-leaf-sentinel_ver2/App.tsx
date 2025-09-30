import React, { useState, useCallback } from 'react';
import SinglePrediction from './components/SinglePrediction';
import BatchPrediction from './components/BatchPrediction';
import RealTimePrediction from './components/RealTimePrediction';
import DiseaseLibrary from './components/DiseaseLibrary';
import { Page } from './types';
import { PhotoIcon, CameraIcon, ViewfinderCircleIcon, BookOpenIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.SINGLE);

  const renderPage = useCallback(() => {
    switch (currentPage) {
      case Page.SINGLE:
        return <SinglePrediction />;
      case Page.BATCH:
        return <BatchPrediction />;
      case Page.REALTIME:
        return <RealTimePrediction />;
      case Page.LIBRARY:
        return <DiseaseLibrary />;
      default:
        return <SinglePrediction />;
    }
  }, [currentPage]);
  
  const navItems = [
    { id: Page.SINGLE, icon: <PhotoIcon className="w-6 h-6 mb-1" />, label: 'Single Scan' },
    { id: Page.BATCH, icon: <CameraIcon className="w-6 h-6 mb-1" />, label: 'Batch Scan' },
    { id: Page.REALTIME, icon: <ViewfinderCircleIcon className="w-6 h-6 mb-1" />, label: 'Real-time' },
    { id: Page.LIBRARY, icon: <BookOpenIcon className="w-6 h-6 mb-1" />, label: 'Library' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
       <header className="flex items-center justify-center p-4 h-20 border-b border-gray-700 bg-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          <h1 className="text-xl font-bold ml-3 text-white">Durian Leaf Sentinel</h1>
        </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
       <nav className="w-full bg-gray-800 border-t border-gray-700 flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center justify-center w-full pt-3 pb-2 transition-colors duration-200 ${
                currentPage === item.id
                  ? 'text-green-400'
                  : 'text-gray-400 hover:text-green-400'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
    </div>
  );
};

export default App;