import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FileUploader from './FileUploader';
import { getBatchPredictions } from '../services/geminiService';
import { BatchPredictionItem } from '../types';
import Spinner from './Spinner';
import { ArrowPathIcon, PlayIcon } from './icons/Icons';

const COLORS: { [key: string]: string } = {
  'Healthy': '#10B981', // Emerald 500
  'Anthracnose': '#F59E0B', // Amber 500
  'Leaf Blight': '#EF4444', // Red 500
  'Sooty Mold': '#6B7280', // Gray 500
  'Dieback': '#8B5CF6', // Violet 500
};

const BatchPrediction: React.FC = () => {
  const [items, setItems] = useState<BatchPredictionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFilesSelect = (files: File[]) => {
    const newItemsPromises = files.map(file => {
      return new Promise<BatchPredictionItem>(resolve => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            image: e.target?.result as string,
            result: null,
          });
        };
        reader.readAsDataURL(file);
      });
    });
  
    Promise.all(newItemsPromises).then(newItems => {
      setItems(prev => [...prev, ...newItems]);
    });
  };

  const handleStartAnalysis = async () => {
    const itemsToPredict = items.filter(item => !item.result);
    if (itemsToPredict.length === 0) return;
  
    setIsLoading(true);
    
    const imagesToPredict = itemsToPredict.map(item => item.image);
    const predictions = await getBatchPredictions(imagesToPredict);
  
    setItems(prevItems => {
      const predictedIds = new Set(itemsToPredict.map(item => item.id));
      let predictionIndex = 0;
      return prevItems.map(item => {
        if (predictedIds.has(item.id)) {
          return { ...item, result: predictions[predictionIndex++] };
        }
        return item;
      });
    });
  
    setIsLoading(false);
  };

  const handleClearBatch = () => {
    setItems([]);
  };

  const itemsPending = useMemo(() => items.some(item => !item.result), [items]);

  const chartData = useMemo(() => {
    const counts = items.reduce((acc, item) => {
      if (item.result) {
        acc[item.result.label] = (acc[item.result.label] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [items]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Batch Prediction</h1>
      <p className="text-gray-400 mb-6">Upload multiple images to get a statistical overview of leaf health.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                <FileUploader onFilesSelect={handleFilesSelect} text="Add images to the batch..." multiple={true} />
                {(items.length > 0) && (
                    <div className="flex space-x-4 mt-4">
                        <button 
                            onClick={handleStartAnalysis} 
                            disabled={!itemsPending || isLoading}
                            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            <PlayIcon className="w-5 h-5 mr-2" />
                            Start Analysis
                        </button>
                        <button 
                            onClick={handleClearBatch} 
                            disabled={isLoading}
                            className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:bg-gray-600"
                        >
                            <ArrowPathIcon className="w-5 h-5 mr-2" />
                            Clear Batch
                        </button>
                    </div>
                )}
            </div>

            <div className="relative">
                {isLoading && <Spinner text="Analyzing batch..." />}
                {items.length === 0 && (
                <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
                    <p className="text-gray-500">Uploaded images will appear here</p>
                </div>
                )}
                
                {items.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {items.map((item) => (
                    <div key={item.id} className="relative aspect-square bg-gray-700 rounded-lg overflow-hidden group">
                        <img src={item.image} alt="Leaf" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end p-2">
                            {item.result ? (
                                <div className="text-white text-xs font-semibold">
                                    <p style={{color: COLORS[item.result.label] || '#FFFFFF' }}>{item.result.label}</p>
                                    <p className="text-gray-300">{(item.result.confidence * 100).toFixed(1)}%</p>
                                </div>
                            ) : (
                                <div className="text-white text-xs font-semibold">
                                    <p>Pending...</p>
                                </div>
                            )}
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">Analysis Summary</h3>
            {items.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Results will be shown here.</p>
                </div>
            ) : (
                <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                        {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '0.5rem' }} />
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BatchPrediction;