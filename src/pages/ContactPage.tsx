import React, { useState } from 'react';
import { Mail, MessageCircle, Send, MapPin, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ContactPage() {
  const { translate, trackAction } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    trackAction({
      timestamp: Date.now(),
      action: 'contact_form_submit',
      details: { hasMessage: !!formData.message },
    });

    setIsSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {translate('contact.title')}
        </h1>
        <p className="text-xl text-gray-600">
          {translate('contact.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
          
          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-600 mb-4">
                <MessageCircle className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Message Sent Successfully!
              </h3>
              <p className="text-green-600">
                Thank you for contacting us. We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('contact.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('contact.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {translate('contact.send')}
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-blue-600 mr-3 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">contact@digitallibrary.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-5 w-5 text-blue-600 mr-3 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Address</h3>
                <p className="text-gray-600">
                  123 Library Street<br />
                  Digital City, DC 12345<br />
                  United States
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Office Hours</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}