// src/services/openai.ts

// OpenAI API configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class OpenAIService {
  private apiKey: string;
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    this.apiKey = OPENAI_API_KEY || '';

    // Initialize system prompt
    this.conversationHistory.push({
      role: 'system',
      content: 'You are a helpful AI grant writing assistant. Help users write grant proposals by asking relevant questions and providing guidance. Keep responses concise and conversational. Respond naturally as if speaking aloud.'
    });

    console.log('🔧 OpenAI Service initialized');
    console.log('🔧 API Key exists:', !!this.apiKey);
  }

  /**
   * Send message to GPT-4o and get response
   */
  async chat(userMessage: string): Promise<string> {
    try {
      console.log('💬 Sending message to GPT-4o...');

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: this.conversationHistory,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      console.log('💬 OpenAI response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API failed: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      console.log('✅ OpenAI response received:', assistantMessage);

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      return assistantMessage;
    } catch (error) {
      console.error('❌ Error in OpenAI chat:', error);
      throw error;
    }
  }

  /**
   * Reset conversation history
   */
  resetConversation() {
    console.log('🔄 Resetting conversation history');
    this.conversationHistory = [{
      role: 'system',
      content: 'You are a helpful AI grant writing assistant. Help users write grant proposals by asking relevant questions and providing guidance. Keep responses concise and conversational. Respond naturally as if speaking aloud.'
    }];
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();
