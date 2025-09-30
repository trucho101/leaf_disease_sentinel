
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PredictionResult } from '../types';
import { getSinglePrediction } from '../services/geminiService';
import { PlayIcon, StopIcon } from './icons/Icons';

const RealTimePrediction: React.FC = () => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  const stopPrediction = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPredicting(false);
  }, []);

  const cleanupCamera = useCallback(() => {
    stopPrediction();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if(videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stopPrediction]);
  
  const startPrediction = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not supported on this device.");
        return;
    }
    cleanupCamera();
    setPrediction(null);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }

        setIsPredicting(true);

        intervalRef.current = window.setInterval(async () => {
            if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const imageDataUrl = canvas.toDataURL('image/jpeg');
                
                try {
                  const result = await getSinglePrediction(imageDataUrl);
                  setPrediction(result);
                } catch (error) {
                    console.error("Real-time prediction failed:", error);
                }
            }
        }, 2000); // Predict every 2 seconds

    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access the camera. Please check permissions.");
    }
  }, [cleanupCamera]);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      cleanupCamera();
    };
  }, [cleanupCamera]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Real-time Prediction</h1>
      <p className="text-gray-400 mb-6">Use your camera for live disease detection. Point it at a durian leaf.</p>
      
      <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
        
        {!isPredicting && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <button onClick={startPrediction} className="flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300 text-lg">
              <PlayIcon className="w-6 h-6 mr-2" />
              Start Detection
            </button>
          </div>
        )}

        {isPredicting && (
            <div className="absolute top-4 right-4">
                 <button onClick={cleanupCamera} className="flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300">
                    <StopIcon className="w-5 h-5 mr-2" />
                    Stop
                 </button>
            </div>
        )}

        {isPredicting && prediction && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-4 rounded-lg text-white">
                <p className="text-xl font-bold">{prediction.label}</p>
                <p>Confidence: <span className="font-semibold text-green-400">{(prediction.confidence * 100).toFixed(1)}%</span></p>
                <p>Inference: <span className="font-semibold">{prediction.inferenceTime}ms</span></p>
            </div>
        )}
        
        {isPredicting && showHeatmap && prediction && prediction.label !== 'Healthy' && (
              <div 
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${prediction.heatmapPosition.x}% ${prediction.heatmapPosition.y}%, rgba(255, 0, 0, 0.5) 0%, rgba(255, 165, 0, 0.3) 30%, rgba(255, 255, 0, 0.1) 60%, transparent 70%)`,
                  mixBlendMode: 'overlay'
                }}
              ></div>
        )}
      </div>
    </div>
  );
};

export default RealTimePrediction;
