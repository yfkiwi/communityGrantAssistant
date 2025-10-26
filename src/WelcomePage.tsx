import React from 'react';
import { Mic, FileText, Sparkles, Users, Clock, CheckCircle } from 'lucide-react';

interface WelcomePageProps {
  onStartVoice: () => void;
  onStartUpload: () => void;
}

export function WelcomePage({ onStartVoice, onStartUpload }: WelcomePageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-amber-100 rounded-full">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span className="text-sm font-medium text-amber-900">AI-Powered Grant Writing</span>
          </div>
          
          <h1 className="text-5xl font-bold text-stone-900 mb-4">
            Community Grant Assistant
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-2">
            Create professional funding proposals through natural conversation
          </p>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            Built for CEDOs and small communities in Canada's North
          </p>
        </div>

        {/* Main CTA */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-8 shadow-lg">
            <div className="text-center mb-6">
              <Mic className="w-12 h-12 text-emerald-700 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-stone-900 mb-2">
                Start with Your Voice
              </h2>
              <p className="text-stone-600">
                Just talk naturally. I'll guide you through creating your proposal.
              </p>
            </div>
            
            <button
              onClick={onStartVoice}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-8 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              <Mic className="w-6 h-6" />
              Start Voice Conversation
            </button>
            
            <div className="mt-4 text-center">
              <button
                onClick={onStartUpload}
                className="text-sm text-stone-600 hover:text-stone-800 underline"
              >
                Or upload documents first (optional)
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-sky-700" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-2">Save 38+ Hours</h3>
            <p className="text-sm text-stone-600">
              Reduce grant writing from 40 hours to just 2 hours with AI assistance
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-700" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-2">Context-Aware</h3>
            <p className="text-sm text-stone-600">
              AI learns from your community's plans and aligns with funder requirements
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-stone-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-2">Your Voice</h3>
            <p className="text-sm text-stone-600">
              Maintains your community's authentic voice - no generic consultant language
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-white rounded-xl p-4 border-2 border-stone-200">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 mb-1">Have a Conversation</h4>
                <p className="text-sm text-stone-600">
                  Tell me about your project in your own words. I'll ask clarifying questions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-xl p-4 border-2 border-stone-200">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 mb-1">Upload Documents (When Needed)</h4>
                <p className="text-sm text-stone-600">
                  I'll ask for your CED Plan or funding guidelines when they'll strengthen your proposal.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-xl p-4 border-2 border-stone-200">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 mb-1">Review & Refine</h4>
                <p className="text-sm text-stone-600">
                  I generate sections in real-time. You can edit via voice or text anytime.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-xl p-4 border-2 border-stone-200">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 mb-1">Export & Submit</h4>
                <p className="text-sm text-stone-600">
                  Download your complete proposal as a formatted document ready for submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
