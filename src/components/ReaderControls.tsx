import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Type, 
  Home,
  Search,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReaderControlsProps {
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  onClose: () => void;
  totalPages: number;
}

export function ReaderControls({ 
  onPrevPage, 
  onNextPage, 
  onGoToPage, 
  onClose, 
  totalPages 
}: ReaderControlsProps) {
  const { state, dispatch, translate } = useApp();
  const [pageInput, setPageInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages) {
      onGoToPage(page);
      setPageInput('');
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.stopPropagation();
    }
  };

  const handleZoomIn = () => {
    dispatch({ 
      type: 'SET_READER_SETTINGS', 
      payload: { zoom: Math.min(state.readerSettings.zoom + 0.1, 3) } 
    });
  };

  const handleZoomOut = () => {
    dispatch({ 
      type: 'SET_READER_SETTINGS', 
      payload: { zoom: Math.max(state.readerSettings.zoom - 0.1, 0.5) } 
    });
  };

  const handleFontSizeChange = (size: number) => {
    dispatch({ 
      type: 'SET_READER_SETTINGS', 
      payload: { fontSize: size } 
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Back to Library"
          >
            <Home className="h-5 w-5 text-gray-600" />
          </button>

          <button
            onClick={onPrevPage}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={state.currentPage <= 1}
            title={translate('reader.prevPage')}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <div className="flex items-center space-x-2">
            <form onSubmit={handlePageInputSubmit} className="flex items-center">
              <input
                type="number"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={handlePageInputKeyDown}
                placeholder={state.currentPage.toString()}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max={totalPages}
              />
              <span className="text-gray-500 text-sm ml-2">/ {totalPages}</span>
            </form>
          </div>

          <button
            onClick={onNextPage}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={state.currentPage >= totalPages}
            title={translate('reader.nextPage')}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-5 w-5 text-gray-600" />
          </button>

          <span className="text-sm text-gray-600 min-w-12 text-center">
            {Math.round(state.readerSettings.zoom * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-5 w-5 text-gray-600" />
          </button>

          <div className="h-6 w-px bg-gray-300" />

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Settings"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Font Size:</span>
              <div className="flex space-x-1">
                {[12, 14, 16, 18, 20].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`px-2 py-1 rounded text-xs ${
                      state.readerSettings.fontSize === size
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}