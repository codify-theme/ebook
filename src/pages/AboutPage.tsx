import React from 'react';
import { BookOpen, Users, Globe, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function AboutPage() {
  const { translate } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {translate('about.title')}
        </h1>
        <p className="text-xl text-gray-600">
          {translate('about.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
          </div>
          <p className="text-gray-600">
            We believe in making literature accessible to everyone, regardless of language or location. 
            Our digital library provides free access to classic and contemporary works from around the world.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Multi-Language Support</h3>
          </div>
          <p className="text-gray-600">
            Our platform supports multiple languages with word-by-word translations, 
            making it easier for readers to explore literature in different languages 
            and expand their vocabulary.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-purple-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Community Driven</h3>
          </div>
          <p className="text-gray-600">
            Our library is built by readers for readers. We continuously expand our collection 
            based on community feedback and requests, ensuring we provide the books 
            that matter most to our users.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Heart className="h-8 w-8 text-red-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Open Source</h3>
          </div>
          <p className="text-gray-600">
            This project is open source and available on GitHub. We welcome contributions 
            from developers, translators, and book enthusiasts who want to help improve 
            the platform for everyone.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Join Our Growing Community
        </h2>
        <p className="text-gray-600 mb-6">
          Over 10,000 readers have already discovered their next favorite book through our platform. 
          Join them today and explore a world of literature at your fingertips.
        </p>
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">500+</div>
            <div className="text-gray-600">Books Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">15</div>
            <div className="text-gray-600">Languages Supported</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">24/7</div>
            <div className="text-gray-600">Access</div>
          </div>
        </div>
      </div>
    </div>
  );
}