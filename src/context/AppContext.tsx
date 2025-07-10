import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Book, LanguageConfig, ReaderSettings, UserAction } from '../types';
import { languages, defaultLanguage } from '../data/languages';
import { useAnalytics } from '../hooks/useAnalytics';

interface AppState {
  currentLanguage: LanguageConfig;
  currentBook: Book | null;
  currentPage: number;
  readerSettings: ReaderSettings;
  isReaderOpen: boolean;
  currentRoute: string;
}

type AppAction =
  | { type: 'SET_LANGUAGE'; payload: LanguageConfig }
  | { type: 'SET_CURRENT_BOOK'; payload: Book | null }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_READER_SETTINGS'; payload: Partial<ReaderSettings> }
  | { type: 'SET_READER_OPEN'; payload: boolean }
  | { type: 'SET_CURRENT_ROUTE'; payload: string };

const initialState: AppState = {
  currentLanguage: defaultLanguage,
  currentBook: null,
  currentPage: 1,
  readerSettings: {
    fontSize: 16,
    zoom: 1,
    theme: 'light',
    language: 'en',
  },
  isReaderOpen: false,
  currentRoute: 'home',
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  trackAction: (action: UserAction) => void;
  translate: (key: string) => string;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, currentLanguage: action.payload };
    case 'SET_CURRENT_BOOK':
      return { ...state, currentBook: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_READER_SETTINGS':
      return { 
        ...state, 
        readerSettings: { ...state.readerSettings, ...action.payload } 
      };
    case 'SET_READER_OPEN':
      return { ...state, isReaderOpen: action.payload };
    case 'SET_CURRENT_ROUTE':
      return { ...state, currentRoute: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { trackUserAction } = useAnalytics();

  const trackAction = (action: UserAction) => {
    trackUserAction(action);
  };

  const translate = (key: string): string => {
    return state.currentLanguage.translations[key] || key;
  };

  return (
    <AppContext.Provider value={{ state, dispatch, trackAction, translate }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}