import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { ReaderControls } from './ReaderControls';
import { TranslationPopup } from './TranslationPopup';
import { wordTranslations } from '../data/translations';

interface BookReaderProps {
  onClose: () => void;
}

export function BookReader({ onClose }: BookReaderProps) {
  const { state, dispatch, trackAction } = useApp();
  const [translationPopup, setTranslationPopup] = useState<{
    word: string;
    translation: string;
    position: { x: number; y: number };
  } | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);

  const { currentBook, currentPage, readerSettings } = state;

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPage - 1 });
      scrollToTop();
      trackAction({
        timestamp: Date.now(),
        action: 'page_turn',
        book: currentBook?.title,
        details: { direction: 'prev', page: currentPage - 1 },
      });
    }
  }, [currentPage, currentBook, dispatch, scrollToTop, trackAction]);

  const handleNextPage = useCallback(() => {
    if (currentBook && currentPage < currentBook.pages) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPage + 1 });
      scrollToTop();
      trackAction({
        timestamp: Date.now(),
        action: 'page_turn',
        book: currentBook?.title,
        details: { direction: 'next', page: currentPage + 1 },
      });
    }
  }, [currentPage, currentBook, dispatch, scrollToTop, trackAction]);

  const handleGoToPage = useCallback((page: number) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
    scrollToTop();
    trackAction({
      timestamp: Date.now(),
      action: 'page_jump',
      book: currentBook?.title,
      details: { page },
    });
  }, [currentBook, dispatch, scrollToTop, trackAction]);

  const handleWordClick = useCallback((e: React.MouseEvent, word: string) => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    const translation = wordTranslations[state.currentLanguage.code]?.[cleanWord];
    
    if (translation) {
      setTranslationPopup({
        word: cleanWord,
        translation,
        position: { x: e.clientX, y: e.clientY },
      });
      
      trackAction({
        timestamp: Date.now(),
        action: 'word_translation',
        book: currentBook?.title,
        details: { word: cleanWord, language: state.currentLanguage.code },
      });
    }
  }, [state.currentLanguage.code, currentBook, trackAction]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
  }, [touchStartX, touchStartY, handleNextPage, handlePrevPage]);

  // Handle back button on mobile
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        handleNextPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevPage, handleNextPage, onClose]);

  if (!currentBook) return null;

  const sampleText = `
    This is a sample page from "${currentBook.title}" by ${currentBook.author}.
    
    In this digital edition, you can click on any word to see its translation in other languages.
    Try clicking on words like "book", "read", "story", or "library" to see the translation feature in action.
    
    Use the controls at the bottom to navigate between pages, adjust zoom level, and modify font size.
    You can also swipe left or right on mobile devices to turn pages.
    
    This reader supports responsive design and works seamlessly across all devices.
    The interface adapts to different screen sizes and input methods.
    
    Page ${currentPage} of ${currentBook.pages}
  `;

  return (
    <div className="fixed inset-0 bg-white z-30 overflow-auto">
      <div
        className="min-h-screen p-4 pb-24"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          fontSize: `${readerSettings.fontSize}px`,
          transform: `scale(${readerSettings.zoom})`,
          transformOrigin: 'top left',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {currentBook.title}
            </h1>
            <p className="text-gray-600 mb-6">by {currentBook.author}</p>
            
            <div className="prose prose-lg max-w-none">
              {sampleText.split(' ').map((word, index) => (
                <span
                  key={index}
                  className="hover:bg-yellow-100 cursor-pointer transition-colors"
                  onClick={(e) => handleWordClick(e, word)}
                >
                  {word}{' '}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ReaderControls
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onGoToPage={handleGoToPage}
        onClose={onClose}
        totalPages={currentBook.pages}
      />

      {translationPopup && (
        <TranslationPopup
          word={translationPopup.word}
          translation={translationPopup.translation}
          position={translationPopup.position}
          onClose={() => setTranslationPopup(null)}
        />
      )}
    </div>
  );
}