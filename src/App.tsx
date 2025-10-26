import React, { useState } from 'react';
import { WelcomePage } from './WelcomePage';
import { AssistantPage } from './AssistantPage';
import { ViewType } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('welcome');

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <WelcomePage
            onStartVoice={() => setCurrentView('assistant')}
            onStartUpload={() => setCurrentView('assistant')}
          />
        );
      
      case 'assistant':
        return (
          <AssistantPage
            onBack={() => setCurrentView('welcome')}
            onReview={() => setCurrentView('review')}
          />
        );
      
      case 'review':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-stone-900 mb-4">
                Review Page
              </h1>
              <p className="text-stone-600 mb-6">
                This would show the complete proposal for final review and export
              </p>
              <button
                onClick={() => setCurrentView('assistant')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
              >
                Back to Assistant
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return <div className="min-h-screen">{renderView()}</div>;
}
