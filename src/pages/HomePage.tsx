import React from 'react';
import { BookCard } from '../components/BookCard';
import { useApp } from '../context/AppContext';
import { sampleBooks } from '../data/books';
import { Book } from '../types';

interface HomePageProps {
  onOpenBook: (book: Book) => void;
}

export function HomePage({ onOpenBook }: HomePageProps) {
  const { state, translate, trackAction } = useApp();

  const filteredBooks = sampleBooks.filter(
    book => book.language === state.currentLanguage.code
  );

  const handleBookSelect = (book: Book) => {
    onOpenBook(book);
    trackAction({
      timestamp: Date.now(),
      action: 'book_open',
      book: book.title,
      details: { author: book.author, language: book.language },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {translate('library.title')}
        </h1>
        <p className="text-xl text-gray-600">
          {translate('library.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onSelect={handleBookSelect}
          />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No books available in {state.currentLanguage.displayName}
          </p>
        </div>
      )}
    </div>
  );
}