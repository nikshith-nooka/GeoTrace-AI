import React from 'react';
import { ArrowLeftIcon } from './icons';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, className }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-full glass border-white/10 text-white hover:bg-white/10 transition-all active:scale-95 shadow-xl ${className}`}
  >
    <ArrowLeftIcon className="w-6 h-6" />
  </button>
);