// src/services/eventlabs.ts

// EventLabs API configuration
const EVENTLABS_API_KEY = (import.meta as any).env.VITE_EVENTLABS_API_KEY;
const EVENTLABS_ENDPOINT = (import.meta as any).env.VITE_EVENTLABS_ENDPOINT;

interface EventLabsConfig {
  apiKey: string;
  endpoint: string;
}

class EventLabsService {
  private config: EventLabsConfig;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor() {
    this.config = {
      apiKey: EVENTLABS_API_KEY || '',
      endpoint: EVENTLABS_ENDPOINT || '',
    };
  }

  /**
   * Start recording audio from microphone
   */
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      console.log('🎤 Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to access microphone');
    }
  }

  /**
   * Stop recording and return audio blob
   */
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        console.log('🎤 Recording stopped, size:', audioBlob.size);
        
        // Stop all tracks
        if (this.mediaRecorder?.stream) {
          this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Send audio to EventLabs for transcription
   */
  async speechToText(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', 'en'); // Adjust as needed

      // ElevenLabs Speech-to-Text endpoint
      const response = await fetch(`${this.config.endpoint}/speech-to-text`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          // Note: Don't set Content-Type, browser will set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`STT request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📝 Transcription:', data.text);
      
      return data.text || data.transcript || '';
    } catch (error) {
      console.error('Error in speech-to-text:', error);
      throw error;
    }
  }

  /**
   * Convert text to speech using EventLabs
   */
  async textToSpeech(text: string): Promise<string> {
    try {
      // ElevenLabs Text-to-Speech endpoint
      const response = await fetch(`${this.config.endpoint}/text-to-speech`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice: 'en-US-Neural', // Adjust voice as needed
          speed: 1.0,
          pitch: 1.0,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.statusText}`);
      }

      // Get audio data as blob
      const audioBlob = await response.blob();
      
      // Create object URL for playback
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('🔊 TTS audio generated');
      
      return audioUrl;
    } catch (error) {
      console.error('Error in text-to-speech:', error);
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
