# Modern Ebook Reader Website

A production-ready, responsive ebook reader website built with React, TypeScript, and Tailwind CSS. This application provides a comprehensive digital library experience with advanced features like multi-language support, word-by-word translations, and mobile-optimized reading.

## Features

### Core Functionality
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Multi-Language Support**: English, Spanish, and French with easy language switching
- **Advanced Reader**: Touch gestures, keyboard navigation, zoom controls, and customizable settings
- **Word-by-Word Translation**: Hover over words to see translations in other languages
- **Smart Navigation**: Page jumping, smooth scrolling, and mobile-friendly controls

### User Experience
- **Touch Gestures**: Swipe left/right to turn pages on mobile devices
- **Keyboard Shortcuts**: Arrow keys for navigation, Escape to close reader
- **Mobile Back Button**: Captures mobile back button to return to library instead of exiting
- **Draggable Scrollbars**: Optimized for tablet interaction
- **No-Refresh Navigation**: Prevents page refresh when using backspace in input fields

### Analytics & Tracking
- **Google Analytics Integration**: Session tracking and user behavior analysis
- **User Flow Tracking**: Detailed logging of user interactions and reading patterns
- **Local Storage**: Preserves user preferences and reading progress

### Technical Features
- **Modern Web Standards**: HTML5, CSS3, ES6+ JavaScript
- **No Server-Side Dependencies**: Pure client-side application suitable for GitHub Pages
- **Optimized Performance**: Efficient rendering and smooth animations
- **Accessibility**: High contrast colors optimized for eReaders

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BookCard.tsx
│   ├── BookReader.tsx
│   ├── Navigation.tsx
│   ├── ReaderControls.tsx
│   └── TranslationPopup.tsx
├── context/            # React Context for state management
│   └── AppContext.tsx
├── data/               # Static data and configurations
│   ├── books.ts
│   ├── languages.ts
│   └── translations.ts
├── hooks/              # Custom React hooks
│   ├── useAnalytics.ts
│   └── useLocalStorage.ts
├── pages/              # Main application pages
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   └── HomePage.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
└── App.tsx            # Main application component
```

## Configuration

### Adding New Languages
1. Update `src/data/languages.ts` with new language configuration
2. Add translations in the `translations` object
3. Update `src/data/translations.ts` with word-by-word translations

### Google Analytics Setup
Replace `GA_MEASUREMENT_ID` in `src/hooks/useAnalytics.ts` with your actual Google Analytics measurement ID.

### Adding New Books
Update `src/data/books.ts` with new book entries following the Book interface structure.

## Deployment

This application is designed to be deployed on GitHub Pages or any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure your domain and SSL settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on different devices
5. Submit a pull request

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the MIT License.

## Support

For questions or support, please use the contact form in the application or open an issue on GitHub.