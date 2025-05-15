import React from 'react';
import { FileText, Calendar, Users } from 'lucide-react';

export const AppHeader: React.FC = () => {
  return (
    <header className="bg-blue-700 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users size={24} className="text-white" />
          <h1 className="text-2xl font-bold">Учет рабочего времени</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Calendar size={18} />
            <span className="text-sm md:text-base">
              {new Date().toLocaleDateString('ru-RU')}
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <FileText size={18} />
            <span>Версия 1.0</span>
          </div>
        </div>
      </div>
    </header>
  );
};