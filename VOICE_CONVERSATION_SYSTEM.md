# Voice Conversation System - Complete Implementation

## Overview

A complete voice-to-voice conversation system that implements:
1. **STT (Speech-to-Text)** - Using Web Speech API
2. **AI Chat** - Using GPT-4o via OpenAI API
3. **TTS (Text-to-Speech)** - Using ElevenLabs API

## Flow Diagram

```
User Voice Input
      ↓
1. Web Speech API (STT)
      ↓
   User Text Message
      ↓
2. GPT-4o (AI Response)
      ↓
   AI Text Response
      ↓
3. ElevenLabs (TTS)
      ↓
4. Audio Playback
      ↓
User Hears AI Response
```

## Implementation Details

### 1. STT - Web Speech API
**File:** `src/services/eventlabs.ts`

- Uses browser's built-in `webkitSpeechRecognition`
- No network calls needed
- Real-time speech recognition
- Returns transcript as string

**Method:**
```typescript
async speechToText(audioBlob?: Blob): Promise<string>
```

### 2. AI Chat - GPT-4o
**File:** `src/services/openai.ts`

- Sends user message to GPT-4o
- Maintains conversation history
- Returns AI response text
- Configurable via system prompt

**Method:**
```typescript
async chat(userMessage: string): Promise<string>
```

**Configuration:**
- Model: `gpt-4o`
- Temperature: `0.7`
- Max tokens: `500`
- System prompt: Grant writing assistant focused on helping users write proposals

### 3. TTS - ElevenLabs
**File:** `src/services/eventlabs.ts`

- Converts text to speech using ElevenLabs API
- Returns audio URL for playback
- Uses default voice ID: `21m00Tcm4TlvDq8ikWAM`

**Method:**
```typescript
async textToSpeech(text: string, voiceId?: string): Promise<string>
```

### 4. Integration
**File:** `src/AssistantPage.tsx`

**Method:** `handleStopListening()`

Implements the complete workflow:

```typescript
// 1. STT: Get user speech as text
const transcript = await eventLabsService.speechToText();

// 2. Display user message
setMessages([...messages, userMessage]);

// 3. Get AI response from GPT-4o
const aiResponse = await openAIService.chat(transcript);

// 4. Convert AI response to speech
const audioUrl = await eventLabsService.textToSpeech(aiResponse);

// 5. Display AI message with audio
setMessages([...messages, assistantMessage]);

// 6. Auto-play audio
await eventLabsService.playAudio(audioUrl);
```

## Environment Variables

Create/update `.env` file with:

```bash
# ElevenLabs (for TTS)
VITE_EVENTLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxx
VITE_EVENTLABS_ENDPOINT=https://api.elevenlabs.io

# OpenAI (for GPT-4o)
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
```

## Usage

1. **User speaks** into microphone
2. **Click "Stop Recording"**
3. System automatically:
   - Converts speech to text
   - Sends to GPT-4o
   - Gets AI response
   - Converts to speech
   - Plays audio response

## Features

### Conversation History
- GPT-4o maintains context across messages
- Conversation flows naturally
- Context-aware responses

### System Prompt
The AI is configured as a helpful grant writing assistant that:
- Asks relevant questions
- Provides guidance
- Keeps responses concise
- Responds conversationally

### Error Handling
- Graceful degradation on errors
- User-friendly error messages
- Console logging for debugging

## Console Logging

Watch the browser console for detailed flow:

```
🎤 Step 1: Converting speech to text...
✅ STT Result: [user speech]
💬 Step 2: Generating AI response...
💬 Sending message to GPT-4o...
✅ OpenAI response received: [AI response]
🔊 Step 3: Converting AI response to speech...
🔍 TTS Endpoint: https://api.elevenlabs.io/v1/text-to-speech/...
✅ TTS audio generated: blob:...
▶️ Step 4: Playing AI voice response...
✅ Complete voice conversation cycle finished
```

## Files Modified/Created

### Created:
- `src/services/openai.ts` - OpenAI GPT-4o integration

### Modified:
- `src/services/eventlabs.ts` - Updated speechToText() to accept optional audioBlob
- `src/AssistantPage.tsx` - Updated handleStopListening() with full voice conversation flow
- `src/vite-env.d.ts` - Added VITE_OPENAI_API_KEY type
- `.env.example` - Added OpenAI API key configuration

## Testing

1. Ensure all environment variables are set
2. Restart dev server (`npm run dev`)
3. Open browser console
4. Click "Hold to Speak"
5. Speak into microphone
6. Click "Stop Recording"
7. Watch console for step-by-step progress
8. Hear AI voice response automatically play

## Costs

### Free:
- ✅ Web Speech API (STT) - Browser built-in
- ❌ GPT-4o - Pay per token (~$2.50 per 1M input tokens)
- ❌ ElevenLabs TTS - Pay per character

### Cost Optimization:
- Consider using GPT-4 Turbo for lower costs
- Limit max_tokens to reduce API costs
- Cache common responses

## Troubleshooting

### No transcript received:
- Check microphone permissions
- Verify browser supports Web Speech API (Chrome/Edge recommended)

### OpenAI API fails:
- Verify VITE_OPENAI_API_KEY is set correctly
- Check API quota and billing
- Verify network connectivity

### TTS fails:
- Check VITE_EVENTLABS_API_KEY
- Verify ElevenLabs API endpoint
- Check network connectivity

## Future Enhancements

1. **Streaming responses** - Stream GPT-4o tokens as they generate
2. **Voice activity detection** - Auto-start/stop recording
3. **Interruption handling** - Allow user to interrupt AI response
4. **Multi-language support** - Support multiple languages
5. **Voice selection** - Let user choose TTS voice
6. **Response timeout** - Handle long-running API calls
7. **Offline mode** - Use local models for basic functionality
