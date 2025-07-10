import React from 'react';
import { Home, Info, Mail, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export function MobileMenu({ isOpen, onClose, onNavigate }: MobileMenuProps) {
  const { state, translate, trackAction } = useApp();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleNavigation = (route: string) => {
    onNavigate(route);
    onClose();
    trackAction({
      timestamp: Date.now(),
      action: 'mobile_navigation',
      page: route,
    });
  };

  const menuItems = [
    { route: 'home', icon: Home, label: translate('nav.home') },
    { route: 'about', icon: Info, label: translate('nav.about') },
    { route: 'contact', icon: Mail, label: translate('nav.contact') },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-6">
            <ul className="space-y-2 px-4">
              {menuItems.map(({ route, icon: Icon, label }) => (
                <li key={route}>
                  <button
                    onClick={() => handleNavigation(route)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      state.currentRoute === route
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                {translate('library.title')}
              </p>
              <p className="text-xs text-gray-400">
                Version 1.0 • Made with ❤️
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}