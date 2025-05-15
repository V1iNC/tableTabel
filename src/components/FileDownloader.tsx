import React from 'react';
import { Download } from 'lucide-react';

interface FileDownloaderProps {
  onClick: () => void;
  disabled: boolean;
}

export const FileDownloader: React.FC<FileDownloaderProps> = ({ 
  onClick, 
  disabled 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download size={20} className="mr-2" />
      Экспорт в Excel
    </button>
  );
};