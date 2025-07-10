import React from 'react';
import { Book, User, Eye } from 'lucide-react';
import { Book as BookType } from '../types';

interface BookCardProps {
  book: BookType;
  onSelect: (book: BookType) => void;
}

export function BookCard({ book, onSelect }: BookCardProps) {
  return (
    <div
      onClick={() => onSelect(book)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
    >
      <div className="relative">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
          {book.language.toUpperCase()}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {book.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <User className="h-4 w-4 mr-1" />
          <span className="text-sm">{book.author}</span>
        </div>
        
        <div className="flex items-center text-gray-500 mb-3">
          <Book className="h-4 w-4 mr-1" />
          <span className="text-sm">{book.pages} pages</span>
        </div>
        
        {book.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {book.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <Eye className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Read Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}