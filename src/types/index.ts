export interface Book {
  id: string;
  title: string;
  author: string;
  language: string;
  path: string;
  cover?: string;
  description?: string;
  pages: number;
}

export interface Translation {
  [key: string]: string;
}

export interface UserAction {
  timestamp: number;
  action: string;
  page?: string;
  book?: string;
  details?: any;
}

export interface LanguageConfig {
  code: string;
  name: string;
  displayName: string;
  booksPath: string;
  translations: Translation;
}

export interface ReaderSettings {
  fontSize: number;
  zoom: number;
  theme: 'light' | 'dark';
  language: string;
}