
import React from 'react';
import { Page } from '../types';
import { CameraIcon, PhotoIcon, ViewfinderCircleIcon } from './icons/Icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: Page.SINGLE, icon: <PhotoIcon className="w-6 h-6" />, label: 'Single Prediction' },
    { id: Page.BATCH, icon: <CameraIcon className="w-6 h-6" />, label: 'Batch Prediction' },
    { id: Page.REALTIME, icon: <ViewfinderCircleIcon className="w-6 h-6" />, label: 'Real-time' },
  ];

  return (
    <nav className="w-16 md:w-64 bg-gray-900 border-r border-gray-700 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center md:justify-start p-4 h-20 border-b border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          <h1 className="hidden md:block text-xl font-bold ml-3 text-white">Durian Sentinel</h1>
        </div>
        <ul className="mt-4">
          {navItems.map((item) => (
            <li key={item.id} className="px-2">
              <button
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="hidden md:block ml-4 font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="hidden md:block p-4 border-t border-gray-700 text-center text-xs text-gray-500">
        <p>Durian Leaf Sentinel v1.0</p>
        <p>&copy; 2024 AI Research Group</p>
      </div>
    </nav>
  );
};

export default Sidebar;
