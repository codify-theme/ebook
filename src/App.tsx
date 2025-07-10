import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BookReader } from './components/BookReader';
import { AppProvider, useApp } from './context/AppContext';
import { Book } from './types';

function AppContent() {
  const { state, dispatch } = useApp();
  
  const handleNavigate = (route: string) => {
    dispatch({ type: 'SET_CURRENT_ROUTE', payload: route });
  };

  const handleOpenBook = (book: Book) => {
    dispatch({ type: 'SET_CURRENT_BOOK', payload: book });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
    dispatch({ type: 'SET_READER_OPEN', payload: true });
  };

  const handleCloseReader = () => {
    dispatch({ type: 'SET_READER_OPEN', payload: false });
    dispatch({ type: 'SET_CURRENT_BOOK', payload: null });
  };

  const renderCurrentPage = () => {
    switch (state.currentRoute) {
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onOpenBook={handleOpenBook} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onNavigate={handleNavigate} />
      
      {state.isReaderOpen ? (
        <BookReader onClose={handleCloseReader} />
      ) : (
        <main className="pb-8">
          {renderCurrentPage()}
        </main>
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;