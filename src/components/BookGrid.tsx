
import React from 'react';
import { Book, ExternalLink, FileText } from 'lucide-react';

interface Book {
  title: string;
  author: string;
  filename: string;
  coverText: string;
  type: string;
  source?: string;
}

interface BookGridProps {
  books: Book[];
  onBookSelect: (book: Book) => void;
  searchQuery: string;
}

const BookGrid = ({ books, onBookSelect, searchQuery }: BookGridProps) => {
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <Book className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <h3 className="text-xl text-amber-700 mb-2">No books found</h3>
        <p className="text-amber-600">Try adjusting your search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book, index) => (
        <div
          key={index}
          onClick={() => onBookSelect(book)}
          className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-amber-100">
            {/* Book Cover */}
            <div className="relative h-48 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 flex items-center justify-center">
              <div className="text-center text-white">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-lg font-bold">{book.coverText}</div>
                <div className="text-xs opacity-75 mt-1">{book.type.toUpperCase()}</div>
              </div>
              
              {book.source === 'url' && (
                <div className="absolute top-2 right-2">
                  <ExternalLink className="w-4 h-4 text-white/80" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </div>
            
            {/* Book Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-amber-700 transition-colors">
                {highlightText(book.title, searchQuery)}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                by {highlightText(book.author, searchQuery)}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  {book.type.toUpperCase()}
                </span>
                <button className="text-amber-600 hover:text-amber-700 transition-colors text-sm font-medium">
                  Read Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookGrid;
