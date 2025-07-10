import React, { useState } from 'react';
import { Menu, Home, BookOpen, Info, Mail, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { languages } from '../data/languages';
import { MobileMenu } from './MobileMenu';

interface NavigationProps {
  onNavigate: (route: string) => void;
}

export function Navigation({ onNavigate }: NavigationProps) {
  const { state, dispatch, translate, trackAction } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLanguageChange = (languageCode: string) => {
    const newLanguage = languages.find(lang => lang.code === languageCode);
    if (newLanguage) {
      dispatch({ type: 'SET_LANGUAGE', payload: newLanguage });
      trackAction({
        timestamp: Date.now(),
        action: 'language_change',
        details: { language: languageCode },
      });
    }
  };

  const handleNavigation = (route: string) => {
    onNavigate(route);
    trackAction({
      timestamp: Date.now(),
      action: 'navigation',
      page: route,
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    trackAction({
      timestamp: Date.now(),
      action: 'mobile_menu_toggle',
      details: { opened: !isMobileMenuOpen },
    });
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b-2 border-gray-100 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">
                {translate('library.title')}
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => handleNavigation('home')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  state.currentRoute === 'home'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="h-4 w-4 mr-1" />
                {translate('nav.home')}
              </button>

              <button
                onClick={() => handleNavigation('about')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  state.currentRoute === 'about'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Info className="h-4 w-4 mr-1" />
                {translate('nav.about')}
              </button>

              <button
                onClick={() => handleNavigation('contact')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  state.currentRoute === 'contact'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Mail className="h-4 w-4 mr-1" />
                {translate('nav.contact')}
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={state.currentLanguage.code}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.displayName}
                    </option>
                  ))}
                </select>
                <Globe className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <button 
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
}