
import React, { useState, useRef, useCallback } from 'react';
import { PredictionResult } from '../types';
import { getSinglePrediction } from '../services/geminiService';
import { DISEASE_INFO } from '../constants';
import DiseaseInfoModal from './DiseaseInfoModal';
import FileUploader from './FileUploader';
import ResultDisplay from './ResultDisplay';
import Spinner from './Spinner';
import { CameraIcon } from './icons/Icons';

const SinglePrediction: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCameraMode, setIsCameraMode] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  }, []);

  const handlePrediction = async (imageDataUrl: string) => {
    setImage(imageDataUrl);
    setPrediction(null);
    setShowHeatmap(false);
    setIsLoading(true);
    try {
      const result = await getSinglePrediction(imageDataUrl);
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed:", error);
      // You can add user-facing error handling here
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (file: File) => {
    setIsCameraMode(false);
    cleanupCamera();
    const reader = new FileReader();
    reader.onload = (e) => {
      handlePrediction(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    cleanupCamera();
    setImage(null);
    setPrediction(null);
    setIsCameraMode(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        console.error("Error accessing camera: ", err);
        setIsCameraMode(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      handlePrediction(dataUrl);
      setIsCameraMode(false);
      cleanupCamera();
    }
  };

  const diseaseInfo = prediction ? DISEASE_INFO[prediction.label] : null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Single Image Prediction</h1>
      <p className="text-gray-400 mb-6">Upload an image or use your camera to identify durian leaf diseases.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex space-x-4 mb-4">
              <FileUploader onFileSelect={handleFileChange} />
              <button onClick={startCamera} className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                <CameraIcon className="w-6 h-6 mr-2" />
                Use Camera
              </button>
          </div>
          <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
            {isLoading && <Spinner text="Analyzing..." />}
            {!isLoading && image && !isCameraMode && <img src={image} alt="Uploaded leaf" className="object-contain h-full w-full" />}
            {!isLoading && !image && !isCameraMode && <p className="text-gray-500">Preview will appear here</p>}
            {isCameraMode && (
              <div className="w-full h-full">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <button onClick={captureImage} className="p-4 bg-red-600 rounded-full hover:bg-red-700 transition-all focus:outline-none focus:ring-4 focus:ring-red-400">
                        <CameraIcon className="w-6 h-6 text-white"/>
                    </button>
                </div>
              </div>
            )}
            {showHeatmap && prediction && prediction.label !== 'Healthy' && (
              <div 
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${prediction.heatmapPosition.x}% ${prediction.heatmapPosition.y}%, rgba(255, 0, 0, 0.6) 0%, rgba(255, 165, 0, 0.4) 30%, rgba(255, 255, 0, 0.2) 60%, transparent 80%)`,
                  mixBlendMode: 'overlay'
                }}
              ></div>
            )}
          </div>
        </div>

        <ResultDisplay 
            prediction={prediction}
            isLoading={isLoading}
            onShowHeatmapToggle={() => setShowHeatmap(prev => !prev)}
            onLearnMore={() => setIsModalOpen(true)}
            showHeatmap={showHeatmap}
        />
      </div>

      {isModalOpen && diseaseInfo && (
        <DiseaseInfoModal info={diseaseInfo} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default SinglePrediction;

