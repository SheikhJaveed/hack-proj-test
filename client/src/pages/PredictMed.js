import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';

function PredictMed() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };

    setChatHistory([...chatHistory, userMessage]);
    setInput('');
    setLoading(true);

    try {
      console.log('Sending request to backend...');
      const response = await fetch('http://localhost:5000/api/healthcare/healthcare_democratization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          question: input 
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API endpoint not found. Please check if the server is running and the endpoint is correct.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      const botMessage = {
        type: 'bot',
        text: data.answer,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage = {
        type: 'bot',
        text: `Error: ${error.message || 'Failed to connect to the server. Please ensure the backend is running on port 5000.'}`,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-blue-600">
            <h2 className="text-2xl font-bold text-white">Medical Text Simplifier</h2>
            <p className="text-blue-100 mt-2">
              Enter medical text and I'll help explain the terms in simple language.
            </p>
          </div>

          {/* Chat History */}
          <div className="h-[500px] overflow-y-auto p-6">
            <div className="space-y-6">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-lg rounded-lg p-4 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start">
                      <MessageCircle className="h-5 w-5 mr-2 mt-1" />
                      <div>
                        <p>{message.text}</p>
                        {message.medicalTerms && message.medicalTerms.length > 0 && (
                          <div className="mt-4 border-t pt-2">
                            <h4 className="font-semibold mb-2">Medical Terms Explained:</h4>
                            <ul className="list-disc pl-4 space-y-1">
                              {message.medicalTerms.map((term, i) => (
                                <li key={i}>
                                  <span className="font-medium">{term.term}</span>: {term.explanation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="text-xs mt-2 opacity-75">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter medical text to simplify..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              Enter medical text and get explanations for medical terms in simple language.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictMed;