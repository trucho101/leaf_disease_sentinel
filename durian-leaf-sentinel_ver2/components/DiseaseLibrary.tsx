import React, { useState, useMemo } from 'react';
import { DISEASE_INFO } from '../constants';
import { DiseaseInfo } from '../types';
import DiseaseInfoModal from './DiseaseInfoModal';
import { MagnifyingGlassIcon } from './icons/Icons';

const DiseaseCard: React.FC<{ disease: DiseaseInfo, onClick: () => void }> = ({ disease, onClick }) => (
    <div 
        className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 cursor-pointer"
        onClick={onClick}
    >
        <h3 className="text-lg font-bold text-white mb-2">{disease.name}</h3>
        <p className="text-gray-400 text-sm line-clamp-3">{disease.description}</p>
    </div>
);

const DiseaseLibrary: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(null);

    const filteredDiseases = useMemo(() => {
        if (!searchTerm) {
            return Object.values(DISEASE_INFO);
        }
        return Object.values(DISEASE_INFO).filter(disease => 
            disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            disease.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            disease.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Disease Library</h1>
            <p className="text-gray-400 mb-6">Search for information about various durian leaf diseases and their treatments.</p>

            <div className="relative mb-6">
                <input 
                    type="text"
                    placeholder="Search by name, symptom, etc."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDiseases.map(disease => (
                    <DiseaseCard 
                        key={disease.name} 
                        disease={disease}
                        onClick={() => setSelectedDisease(disease)}
                    />
                ))}
            </div>

            {filteredDiseases.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500">No diseases found for your search query.</p>
                </div>
            )}

            {selectedDisease && (
                <DiseaseInfoModal 
                    info={selectedDisease} 
                    onClose={() => setSelectedDisease(null)}
                />
            )}
        </div>
    );
};

export default DiseaseLibrary;