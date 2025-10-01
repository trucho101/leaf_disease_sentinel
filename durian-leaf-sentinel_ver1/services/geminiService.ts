
import { PredictionResult } from '../types';
import { DISEASE_CLASSES } from '../constants';


const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getSinglePrediction = async (imageBase64: string): Promise<PredictionResult> => {
  // Simulate network delay
  const delay = 50 + Math.random() * 200; // 50ms to 250ms
  await new Promise(res => setTimeout(res, delay));

  // Simulate model prediction
  const randomLabel = getRandomItem(DISEASE_CLASSES);
  const randomConfidence = Math.random() * (0.99 - 0.85) + 0.85; // Confidence between 85% and 99%

  return {
    label: randomLabel,
    confidence: parseFloat(randomConfidence.toFixed(3)),
    inferenceTime: Math.round(delay),
    heatmapPosition: {
      x: 30 + Math.random() * 40, // Random X between 30% and 70%
      y: 30 + Math.random() * 40, // Random Y between 30% and 70%
    }
  };
};

export const getBatchPredictions = async (images: string[]): Promise<PredictionResult[]> => {
    const predictions = await Promise.all(images.map(image => getSinglePrediction(image)));
    return predictions;
}
