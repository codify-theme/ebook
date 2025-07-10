import { useEffect } from 'react';
import { UserAction } from '../types';

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

export function useAnalytics() {
  useEffect(() => {
    // Initialize Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(script);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    `;
    document.head.appendChild(script2);
  }, []);

  const trackUserAction = (action: UserAction) => {
    // Track in Google Analytics
    if (window.gtag) {
      window.gtag('event', action.action, {
        page_title: action.page,
        book_title: action.book,
        custom_parameter: action.details,
      });
    }

    // Store for user flow analysis
    const userActions = JSON.parse(localStorage.getItem('userActions') || '[]');
    userActions.push(action);
    localStorage.setItem('userActions', JSON.stringify(userActions));
  };

  return { trackUserAction };
}