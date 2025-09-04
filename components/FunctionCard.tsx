
import React from 'react';

interface FunctionCardProps {
  icon: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
}

export const FunctionCard: React.FC<FunctionCardProps> = ({ icon, name, isActive, onClick }) => {
  return (
    <div
      className={`function-card flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
        isActive ? 'bg-purple-600 border-purple-500' : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
      }`}
      onClick={onClick}
    >
      <div className="text-3xl">{icon}</div>
      <div className="text-sm font-medium mt-2">{name}</div>
    </div>
  );
};
