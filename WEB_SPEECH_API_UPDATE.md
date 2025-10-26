# Web Speech API Integration Update

## Summary

The `src/services/eventlabs.ts` file has been updated to use the browser's built-in **Web Speech API** (webkitSpeechRecognition) for Speech-to-Text (STT) instead of the ElevenLabs STT API.

## Changes Made

### 1. STT - Now Uses Web Speech API

**Before:**
- Recorded audio using MediaRecorder
- Uploaded audio blob to ElevenLabs STT API
- Returned transcript from API response

**After:**
- Uses browser's built-in `webkitSpeechRecognition`
- No audio recording or file upload needed
- Real-time speech recognition
- Works offline (browser-dependent)

**Implementation:**
```typescript
async speechToText(): Promise<string> {
  // Uses Web Speech API
  this.recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    resolve(transcript);
  };
  this.recognition.start();
}
```

### 2. TTS - Still Uses ElevenLabs API

- Endpoint: `https://api.elevenlabs.io/v1/text-to-speech/{voiceId}`
- Header: `'xi-api-key': this.config.apiKey`
- Default voice ID: `'21m00Tcm4TlvDq8ikWAM'`
- Returns audio URL for playback

### 3. Simplified Recording Methods

**`startRecording()`:**
- Now just a compatibility method
- Web Speech API doesn't need separate recording step
- Logs status for debugging

**`stopRecording()`:**
- Stops the recognition instance
- Returns empty blob for compatibility
- No audio chunk management needed

## Browser Compatibility

### Supported Browsers:
- ✅ Chrome/Edge (full support)
- ✅ Safari (full support)
- ❌ Firefox (not supported)

### Error Handling:
- `no-speech`: No speech detected
- `audio-capture`: Microphone not found
- `not-allowed`: Microphone permission denied
- `network`: Network error
- Custom error messages for each case

## Benefits

1. **No API Costs**: Web Speech API is free (built into browser)
2. **Faster Response**: No network upload/download
3. **Offline Capable**: Works without internet (depends on browser)
4. **Real-time**: Immediate transcription feedback
5. **Privacy**: Audio stays in browser, not sent to external servers

## Trade-offs

1. **Browser Required**: Only works in supported browsers
2. **Accuracy**: Depends on browser's speech engine (may vary)
3. **Feature Control**: Less control over recognition settings vs API
4. **Language**: Limited to browser-supported languages

## Usage

### In Code:
```typescript
// Before (with audio blob)
const audioBlob = await eventLabsService.stopRecording();
const transcript = await eventLabsService.speechToText(audioBlob);

// After (direct speech recognition)
const transcript = await eventLabsService.speechToText();
```

### User Experience:
1. User clicks "Hold to Speak"
2. Browser requests microphone permission
3. User speaks
4. Web Speech API transcribes in real-time
5. Transcript is returned

## Files Modified

1. `src/services/eventlabs.ts` - Complete rewrite
2. `src/AssistantPage.tsx` - Updated to use new API (no audioBlob parameter)
3. Type definitions added for Web Speech API interfaces

## Debug Logging

The implementation includes extensive logging:
- ✅ Speech Recognition initialized
- 🎤 Speech Recognition started
- ✅ STT Result: [transcript]
- 📝 Confidence: [confidence score]
- ❌ Error messages with specific error types

## Testing

To test the implementation:

1. Open browser console (F12)
2. Click "Hold to Speak"
3. Allow microphone permission
4. Speak into microphone
5. Check console for:
   ```
   ✅ Speech Recognition initialized
   🎤 Speech Recognition started
   ✅ STT Result: [your speech]
   📝 Confidence: 0.95
   ```

## Environment Variables

Still required for TTS:
- `VITE_EVENTLABS_API_KEY` - ElevenLabs API key
- `VITE_EVENTLABS_ENDPOINT` - Should be `https://api.elevenlabs.io`

NOT required for STT anymore (uses Web Speech API).
