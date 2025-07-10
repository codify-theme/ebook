
import React from 'react';
import { Search, Book } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalBooks: number;
  filteredCount: number;
}

const SearchBar = ({ searchQuery, setSearchQuery, totalBooks, filteredCount }: SearchBarProps) => {
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-amber-200 rounded-full shadow-lg focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
        />
      </div>
      
      {searchQuery && (
        <div className="mt-4 text-center text-amber-700">
          <div className="inline-flex items-center bg-amber-100 px-4 py-2 rounded-full">
            <Book className="w-4 h-4 mr-2" />
            Showing {filteredCount} of {totalBooks} books
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
