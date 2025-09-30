
import React, { useCallback, useState } from 'react';
import { ArrowUpTrayIcon } from './icons/Icons';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  text?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, text="Upload an image" }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);
  
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <label 
        className={`w-full flex flex-col items-center justify-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-green-400 bg-gray-700' : 'border-gray-600 bg-gray-800 hover:bg-gray-700'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
    >
      <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 mb-2" />
      <span className="font-semibold text-gray-300">{text}</span>
      <span className="text-xs text-gray-500">or drag and drop</span>
      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
    </label>
  );
};

export default FileUploader;
