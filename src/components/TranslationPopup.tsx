import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TranslationPopupProps {
  word: string;
  translation: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export function TranslationPopup({ word, translation, position, onClose }: TranslationPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 200);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-w-xs transition-all duration-200 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        left: Math.min(position.x, window.innerWidth - 250),
        top: Math.max(position.y - 10, 10),
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{word}</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="text-sm text-gray-600">
        {translation}
      </div>
      
      <div className="absolute bottom-0 left-6 transform translate-y-full">
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
      </div>
    </div>
  );
}