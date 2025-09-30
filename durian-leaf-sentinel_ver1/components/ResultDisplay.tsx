
import React from 'react';
import { PredictionResult } from '../types';
import { BookOpenIcon, SparklesIcon } from './icons/Icons';

interface ResultDisplayProps {
  prediction: PredictionResult | null;
  isLoading: boolean;
  onShowHeatmapToggle: () => void;
  onLearnMore: () => void;
  showHeatmap: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ prediction, isLoading, onShowHeatmapToggle, onLearnMore, showHeatmap }) => {
  if (isLoading || !prediction) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold text-white mb-4">Analysis Results</h2>
        <div className="text-center text-gray-500">
          <p>{isLoading ? 'Awaiting image for analysis...' : 'Results will appear here.'}</p>
        </div>
      </div>
    );
  }

  const confidenceColor = prediction.confidence > 0.9 ? 'text-green-400' : prediction.confidence > 0.75 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 flex flex-col">
      <h2 className="text-xl font-semibold text-white mb-4">Analysis Results</h2>
      <div className="flex-grow space-y-5">
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Predicted Disease</p>
          <p className="text-2xl font-bold text-white">{prediction.label}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Confidence</p>
            <p className={`text-xl font-semibold ${confidenceColor}`}>
              {(prediction.confidence * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Inference Time</p>
            <p className="text-xl font-semibold text-white">{prediction.inferenceTime} ms</p>
          </div>
        </div>
        {prediction.label !== 'Healthy' && (
          <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
            <span className="font-medium text-white">Grad-CAM Heatmap</span>
            <button onClick={onShowHeatmapToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${showHeatmap ? 'bg-green-500' : 'bg-gray-600'}`}>
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${showHeatmap ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        )}
      </div>
      <div className="mt-6">
        <button onClick={onLearnMore} className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300">
          <BookOpenIcon className="w-5 h-5 mr-2" />
          Learn More & Get Treatment
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
