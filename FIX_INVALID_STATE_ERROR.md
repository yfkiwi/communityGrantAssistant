# Fix: InvalidStateError - Recognition Already Started

## Problem

The Web Speech API was throwing an error:
```
InvalidStateError: Failed to execute 'start' on 'SpeechRecognition': 
recognition has already started.
```

## Root Cause

The original implementation created a single `SpeechRecognition` instance in the constructor and reused it for every call to `speechToText()`. 

**The issue:** Once you call `.start()` on a recognition instance, you cannot call `.start()` again until the recognition session has fully ended. If the user clicks quickly or tries to record again before the previous session ended, the second call to `.start()` would fail.

## Solution

**Changed approach:** Create a **new** `SpeechRecognition` instance each time `speechToText()` is called.

### Before (Wrong):
```typescript
class EventLabsService {
  private recognition: SpeechRecognition | null = null;  // ❌ Single instance
  
  async speechToText(): Promise<string> {
    this.recognition!.start();  // ❌ Reusing same instance
  }
}
```

### After (Fixed):
```typescript
async speechToText(): Promise<string> {
  // ✅ Create a NEW instance each time
  const SpeechRecognition = (window as any).SpeechRecognition || 
                           (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();  // ✅ Fresh instance
  
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  // ... set up handlers and start
}
```

## Why This Works

1. **Fresh state**: Each call gets a brand new recognition object in a clean state
2. **No conflicts**: No risk of trying to start an already-started instance
3. **Automatic cleanup**: Once the promise resolves/rejects, the instance is discarded
4. **Simpler code**: Don't need to manage instance state or cleanup

## Testing

After this fix, you should be able to:
1. Click "Hold to Speak"
2. Click "Stop Recording" 
3. Immediately click "Hold to Speak" again (no errors!)
4. Repeat as many times as needed

## Files Modified

- `src/services/eventlabs.ts` - Changed `speechToText()` to create new instances

## Performance

Creating new instances is very lightweight - just a few milliseconds. The Web Speech API is designed to work this way.
