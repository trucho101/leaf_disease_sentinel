
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import SinglePrediction from './components/SinglePrediction';
import BatchPrediction from './components/BatchPrediction';
import RealTimePrediction from './components/RealTimePrediction';
import { Page } from './types';

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
      default:
        return <SinglePrediction />;
    }
  }, [currentPage]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
