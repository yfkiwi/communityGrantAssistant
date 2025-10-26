import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Paperclip, Loader2, Volume2, FileText } from 'lucide-react';
import { Message, Document } from './types';

interface VoiceChatProps {
  messages: Message[];
  isListening: boolean;
  documents: Document[];
  onStartListening: () => void;
  onStopListening: () => void;
  onSendMessage: (text: string) => void;
  onUploadDocument: (file: File) => void;
  onPlayAudio: (messageId: string) => void;
}

export function VoiceChat({
  messages,
  isListening,
  documents,
  onStartListening,
  onStopListening,
  onSendMessage,
  onUploadDocument,
  onPlayAudio,
}: VoiceChatProps) {
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = () => {
    if (textInput.trim()) {
      onSendMessage(textInput);
      setTextInput('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadDocument(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border-2 border-sky-200">
      {/* Header */}
      <div className="p-6 border-b-2 border-sky-200 bg-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">AI Grant Assistant</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm text-stone-600">Ready to help</span>
              </div>
            </div>
          </div>
          
          {documents.length > 0 && (
            <div className="text-sm text-stone-600">
              📄 {documents.length} document{documents.length > 1 ? 's' : ''} uploaded
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-slide-up ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                <Mic className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : message.role === 'system'
                  ? 'bg-amber-100 border-2 border-amber-300 text-amber-900'
                  : 'bg-white border-2 border-stone-200 text-stone-900'
              }`}
            >
              {message.role === 'system' && (
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-semibold">System Update</span>
                </div>
              )}
              
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              
              {message.audioUrl && message.role === 'assistant' && (
                <button
                  onClick={() => onPlayAudio(message.id)}
                  className="mt-2 flex items-center gap-2 text-xs text-emerald-700 hover:text-emerald-800"
                >
                  <Volume2 className="w-3 h-3" />
                  Play audio
                </button>
              )}
              
              <div className="mt-2 text-xs opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">U</span>
              </div>
            )}
          </div>
        ))}
        
        {isListening && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border-2 border-stone-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                Processing your voice...
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Uploaded Documents Display */}
      {documents.length > 0 && (
        <div className="px-6 pb-2">
          <div className="flex flex-wrap gap-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-2 bg-white border-2 border-sky-200 rounded-lg px-3 py-2 text-sm"
              >
                <FileText className="w-4 h-4 text-sky-600" />
                <span className="text-stone-700 font-medium">{doc.name}</span>
                {doc.analyzed && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                    ✓ Analyzed
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 border-t-2 border-sky-200 bg-white/50">
        <div className="space-y-3">
          {/* Voice Input Button */}
          <button
            onClick={isListening ? onStopListening : onStartListening}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white voice-recording'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-6 h-6" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-6 h-6" />
                Hold to Speak
              </>
            )}
          </button>

          {/* Text Input Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTextInput(!showTextInput)}
              className="text-sm text-stone-600 hover:text-stone-800 underline"
            >
              {showTextInput ? 'Hide' : 'Show'} text input
            </button>
            
            <div className="flex-1 h-px bg-stone-200" />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-800 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
              Upload Document
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Text Input */}
          {showTextInput && (
            <div className="flex gap-2 animate-slide-up">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border-2 border-stone-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendText}
                disabled={!textInput.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-3 text-xs text-center text-stone-500">
          💡 Tip: Speak naturally and I'll guide you through the process
        </div>
      </div>
    </div>
  );
}
