
import React from 'react';
import { DiseaseInfo } from '../types';
import { XMarkIcon } from './icons/Icons';

interface DiseaseInfoModalProps {
  info: DiseaseInfo;
  onClose: () => void;
}

const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <svg className="w-5 h-5 mr-2 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>{children}</span>
    </li>
);

const DiseaseInfoModal: React.FC<DiseaseInfoModalProps> = ({ info, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 transition-opacity" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl text-white border border-gray-700 transform transition-all max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800">
          <h2 className="text-2xl font-bold">{info.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">Description</h3>
            <p className="text-gray-300">{info.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">Symptoms</h3>
            <ul className="space-y-2 text-gray-300">
                {info.symptoms.map((symptom, index) => <ListItem key={index}>{symptom}</ListItem>)}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">Control & Management</h3>
            <ul className="space-y-2 text-gray-300">
                {info.management.map((tip, index) => <ListItem key={index}>{tip}</ListItem>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseInfoModal;
