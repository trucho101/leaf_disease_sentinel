
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FileUploader from './FileUploader';
import { getBatchPredictions } from '../services/geminiService';
import { BatchPredictionItem, PredictionResult } from '../types';
import Spinner from './Spinner';

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

  const handleFileChange = async (file: File) => {
    // This component uses the uploader for one-by-one addition for simplicity
    const reader = new FileReader();
    reader.onload = (e) => {
      const newItem: BatchPredictionItem = {
        id: `${file.name}-${Date.now()}`,
        image: e.target?.result as string,
        result: null,
      };
      setItems(prev => [...prev, newItem]);
      predictSingleItem(newItem.id, newItem.image);
    };
    reader.readAsDataURL(file);
  };
  
  const predictSingleItem = async (id: string, image: string) => {
     setIsLoading(true);
     const result = (await getBatchPredictions([image]))[0];
     setItems(prev => prev.map(item => item.id === id ? { ...item, result } : item));
     setIsLoading(false);
  }

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
                <FileUploader onFileSelect={handleFileChange} text="Add an image to the batch..." />
            </div>

            {items.length === 0 && !isLoading && (
              <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
                <p className="text-gray-500">Uploaded images will appear here</p>
              </div>
            )}
            
            {isLoading && items.every(i => !i.result) && <Spinner text="Analyzing batch..."/>}

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
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-dashed border-white rounded-full animate-spin"></div>
                            </div>
                        )}
                     </div>
                   </div>
                 ))}
               </div>
            )}
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
