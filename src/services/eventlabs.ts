// src/services/eventlabs.ts

// EventLabs/ElevenLabs API configuration
const EVENTLABS_API_KEY = import.meta.env.VITE_EVENTLABS_API_KEY;
const EVENTLABS_ENDPOINT = import.meta.env.VITE_EVENTLABS_ENDPOINT;

interface EventLabsConfig {
  apiKey: string;
  endpoint: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

class EventLabsService {
  private config: EventLabsConfig;
  private recognition: SpeechRecognition | null = null;

  constructor() {
    this.config = {
      apiKey: EVENTLABS_API_KEY || '',
      endpoint: EVENTLABS_ENDPOINT || '',
    };

    // Initialize Web Speech API
    this.initializeSpeechRecognition();

    // Debug logging
    console.log('🔧 EventLabs Service initialized');
    console.log('🔧 API Key exists:', !!this.config.apiKey);
    console.log('🔧 Endpoint:', this.config.endpoint || 'NOT SET');
    console.log('🔧 Speech Recognition available:', !!this.recognition);

    if (!this.config.apiKey || !this.config.endpoint) {
      console.warn('⚠️ Missing environment variables. Create a .env file with VITE_EVENTLABS_API_KEY and VITE_EVENTLABS_ENDPOINT');
    }
  }

  /**
   * Initialize Web Speech API (webkitSpeechRecognition)
   */
  private initializeSpeechRecognition(): void {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.error('❌ Speech Recognition not supported in this browser');
        return;
      }

      this.recognition = new SpeechRecognition();
      if (this.recognition) {
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      }

      console.log('✅ Speech Recognition initialized');
    } catch (error) {
      console.error('❌ Error initializing Speech Recognition:', error);
    }
  }

  /**
   * Start recording using Web Speech API
   * Note: This method is kept for compatibility but doesn't actually record audio
   */
  async startRecording(): Promise<void> {
    console.log('🎤 Starting speech recognition...');
    
    if (!this.recognition) {
      throw new Error('Speech Recognition not available in this browser');
    }

    // No actual recording needed with Web Speech API
    // The recognition will start in speechToText()
  }

  /**
   * Stop recording using Web Speech API
   * Note: This method is kept for compatibility
   */
  async stopRecording(): Promise<Blob> {
    console.log('🎤 Stopping speech recognition...');
    
    // Since we now create new instances, we don't need to stop anything
    // Just return empty blob for compatibility

    // Return empty blob for compatibility
    return new Blob([], { type: 'audio/webm' });
  }

  /**
   * Convert speech to text using Web Speech API
   * Note: audioBlob parameter is kept for compatibility but not used
   */
  async speechToText(audioBlob?: Blob): Promise<string> {
    // Create a new recognition instance each time to avoid InvalidStateError
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      throw new Error('Speech Recognition not available in this browser');
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    return new Promise((resolve, reject) => {
      console.log('🔍 Starting STT conversion with Web Speech API...');

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0][0];
        const transcript = result.transcript;
        
        console.log('✅ STT Result:', transcript);
        console.log('📝 Confidence:', result.confidence);
        
        resolve(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('❌ Speech Recognition Error:', event.error, event.message);
        
        let errorMessage = 'Speech recognition failed';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not found. Please check your microphone.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error occurred during speech recognition.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        reject(new Error(errorMessage));
      };

      recognition.onend = () => {
        console.log('🔍 Speech Recognition ended');
      };

      // Start recognition
      try {
        recognition.start();
        console.log('🎤 Speech Recognition started');
      } catch (error: any) {
        console.error('❌ Error starting recognition:', error);
        reject(new Error(`Failed to start speech recognition: ${error.message}`));
      }
    });
  }

  /**
   * Convert text to speech using ElevenLabs API
   */
  async textToSpeech(text: string, voiceId: string = '21m00Tcm4TlvDq8ikWAM'): Promise<string> {
    try {
      console.log('🔍 Starting TTS conversion...');

      if (!this.config.apiKey || !this.config.endpoint) {
        throw new Error('Missing API credentials');
      }

      // ElevenLabs TTS endpoint
      const ttsEndpoint = `${this.config.endpoint}/v1/text-to-speech/${voiceId}`;

      console.log('🔍 TTS Endpoint:', ttsEndpoint);

      const response = await fetch(ttsEndpoint, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      console.log('🔍 TTS Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`TTS request failed: ${response.statusText}\n${errorText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('✅ TTS audio generated:', audioUrl);

      return audioUrl;
    } catch (error) {
      console.error('❌ Error in text-to-speech:', error);
      throw error;
    }
  }

  /**
   * Play audio from URL
   */
  async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl); // Clean up
        resolve();
      };

      audio.onerror = (error) => {
        reject(error);
      };

      audio.play();
    });
  }
}

// Export singleton instance
export const eventLabsService = new EventLabsService();
