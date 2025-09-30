
export enum Page {
  SINGLE = 'single',
  BATCH = 'batch',
  REALTIME = 'realtime',
}

export interface PredictionResult {
  label: string;
  confidence: number;
  inferenceTime: number;
  heatmapPosition: {
    x: number;
    y: number;
  };
}

export interface DiseaseInfo {
  name: string;
  description: string;
  symptoms: string[];
  management: string[];
}

export interface BatchPredictionItem {
  id: string;
  image: string;
  result: PredictionResult | null;
}
