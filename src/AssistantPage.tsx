import React, { useState } from 'react';
import { Checklist } from './Checklist';
import { VoiceChat } from './VoiceChat';
import { Message, Section, Document } from './types';
import { ArrowLeft, Download } from 'lucide-react';
import { eventLabsService } from './services/eventlabs';
import { openAIService } from './services/openai';

interface AssistantPageProps {
  onBack: () => void;
  onReview: () => void;
}

// Initial 11 standard sections
const initialSections: Section[] = [
  { id: '1', title: 'Executive Summary', content: '', status: 'incomplete', aiGenerated: false, isCustom: false, canDelete: false },
  { id: '2', title: 'Community Context', content: '', status: 'incomplete', aiGenerated: false, isCustom: false, canDelete: false },
  { id: '3', title: 'Problem Statement', content: '', status: 'incomplete', aiGenerated: false, isCustom: false, canDelete: false },
  { id: '4', title: 'Project Description & Objectives', content: '', status: 'incomplete', aiGenerated: false, isCustom: false, canDelete: false },
  { id: '5', title: 'Implementation Plan & Governance', content: '', status: 'incomplete', aiGenerated: false, isCustom: false, canDelete: false },
  { id: '6', title: 'Budget & Financial Plan', content: '', status: 'incomplete', aiGenerated: false, isCustom: false, canDelete: false },
  { id: '7', title: 'Outcomes & Evaluation', content: '', status: 'incomplete', aiGenerated: false, isCustom: false, canDelete: false },
  { id: '8', title: 'Alignment & Sustainability', content: '', status: 'incomplete', aiGenerated: false, isCustom: false, canDelete: false },
  { id: '9', title: 'Risk Management', content: '', status: 'incomplete', aiGenerated: false, isCustom: false, canDelete: false },
  { id: '10', title: 'Letters of Support', content: '', status: 'incomplete', aiGenerated: false, isCustom: false, canDelete: true },
  { id: '11', title: 'Attachments', content: '', status: 'incomplete', aiGenerated: false, isCustom: false, canDelete: true },
];

export function AssistantPage({ onBack, onReview }: AssistantPageProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your grant writing assistant. Let's create your proposal together.\n\nTo start, tell me: What project do you want funding for?",
      timestamp: new Date(),
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [conversationStep, setConversationStep] = useState(0);

  // Demo conversation - 10 steps showing full flow
  const demoConversation: any[] = [
    // Step 0: Already set in initial message
    
    // Step 1
    {
      user: "We want to build a community greenhouse to grow fresh food year-round",
      assistant: "That's excellent! A community greenhouse for year-round food production. This type of project often aligns well with food security and climate adaptation funding.\n\nWhich funding program are you applying to?",
      systemUpdate: null,
    },
    
    // Step 2
    {
      user: "Indigenous Community Support Fund",
      assistant: "Perfect! The Indigenous Community Support Fund prioritizes food security, community wellness, and climate adaptation - all great matches for your greenhouse project.\n\nDo you have your Community Economic Development Plan? If you upload it, I can ensure we align your proposal with your community's documented priorities. This makes your application much stronger.",
      systemUpdate: null,
    },
    
    // Step 3: Document upload trigger
    {
      user: "[Uploads CED Plan]",
      assistant: "Thanks for uploading your CED Plan! Give me just a moment to analyze it...",
      systemUpdate: "📄 Analyzing Arctic Bay CED Plan 2024.pdf...\n\n✓ Found key priorities:\n  • Youth employment (mentioned 8 times)\n  • Food security (mentioned 12 times) \n  • Climate adaptation (mentioned 6 times)\n  • Cultural preservation (mentioned 5 times)\n\n✓ Demographic data extracted\n✓ Community challenges identified\n✓ Past initiatives reviewed",
    },
    
    // Step 4
    {
      user: null,
      assistant: "Excellent! I've analyzed your CED Plan and I can see some really strong alignments:\n\n🎯 Your greenhouse project directly addresses your community's TOP priority: food security (mentioned 12 times in your plan)\n\n🎯 It also supports youth employment - your plan mentions needing 15-20 new jobs for young people\n\n🎯 The Indigenous Community Support Fund emphasizes climate adaptation, which your greenhouse addresses through local food production\n\nI'm already drafting your Executive Summary based on this. Now, tell me more about your greenhouse project in your own words - why does your community need this?",
      systemUpdate: "✓ Section 1: Executive Summary - Draft generated\n✓ Section 2: Community Context - In progress",
      sectionUpdates: [
        { id: '1', status: 'complete' as const },
        { id: '2', status: 'in-progress' as const },
      ]
    },
    
    // Step 5
    {
      user: "Right now we have no local food production. Everything is flown in and costs 3-4 times more than down south. Our youth don't have jobs and many are leaving. A greenhouse would let us grow vegetables year-round, employ 10 young people, and teach traditional and modern growing methods together.",
      assistant: "This is really powerful! I love how you're connecting food security, youth employment, AND cultural learning. Let me update the sections with this information...",
      systemUpdate: "✓ Section 2: Community Context - Complete\n✓ Section 3: Problem Statement - Complete\n✓ Section 4: Project Description - Draft generated",
      sectionUpdates: [
        { id: '2', status: 'complete' as const },
        { id: '3', status: 'complete' as const },
        { id: '4', status: 'in-progress' as const },
      ]
    },
    
    // Step 6
    {
      user: null,
      assistant: "Great! I've generated your Problem Statement and started your Project Description. Would you like me to read the Executive Summary back to you so you can hear how it sounds?",
      systemUpdate: null,
    },
    
    // Step 7
    {
      user: "Yes, read it to me",
      assistant: "[Voice would read aloud here]\n\n\"Arctic Bay First Nation proposes to establish a community-owned greenhouse facility to address critical food security challenges while creating employment opportunities for youth. This 3-year project will enable year-round production of fresh vegetables, employ 10 community members, and integrate traditional knowledge with modern sustainable agriculture practices. We request $500,000 to construct facilities, purchase equipment, and deliver training programs. Expected outcomes include improved food security, reduced costs for families, youth skill development, and strengthened community self-reliance - all aligned with the Indigenous Community Support Fund's priorities for sustainable development and community wellness.\"\n\nHow does that sound? Would you like me to adjust anything?",
      systemUpdate: null,
    },
    
    // Step 8
    {
      user: "That's really good! But emphasize the youth employment part more - that's really important to our community",
      assistant: "Absolutely! Youth employment is critical. I'll revise the Executive Summary to lead with that...",
      systemUpdate: "✓ Section 1: Executive Summary - Updated\n  Emphasis added: Youth employment",
      sectionUpdates: [
        { id: '1', content: 'Updated content...' }
      ]
    },
    
    // Step 9
    {
      user: null,
      assistant: "Perfect! I've updated it. Now, I notice your CED Plan really emphasizes youth development and your funding program loves seeing detailed impact plans.\n\nWould you like me to add a dedicated \"Youth Impact & Training Plan\" section? This would strengthen your application by showing concrete details about how young people will benefit.",
      systemUpdate: null,
    },
    
    // Step 10
    {
      user: "Yes, add that section",
      assistant: "Done! I've added \"Youth Impact & Training Plan\" as section 12. Let me draft some content for it based on what you've told me...\n\nNow, let's talk budget. You mentioned $500,000 total. Can you break that down a bit?\n\n- Construction: $300K\n- Equipment: $150K  \n- Training: $50K\n\nIs that right? Any other costs?",
      systemUpdate: "✓ New custom section added: Youth Impact & Training Plan\n✓ Section 12: Youth Impact - Draft generated",
      sectionUpdates: [
        { id: '6', status: 'in-progress' as const }
      ],
      addSection: { title: 'Youth Impact & Training Plan' }
    },
  ];

  // Simulate user response
  const simulateUserResponse = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);

    setTimeout(() => {
      const step = demoConversation[conversationStep];
      if (step && step.assistant) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: step.assistant,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);

        if (step.systemUpdate) {
          setTimeout(() => {
            const sysMessage: Message = {
              id: (Date.now() + 2).toString(),
              role: 'system',
              content: step.systemUpdate!,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, sysMessage]);

            if (step.sectionUpdates) {
              setSections(prev => prev.map(section => {
                const update = step.sectionUpdates?.find((u: any) => u.id === section.id);
                if (update) {
                  return {
                    ...section,
                    status: update.status || section.status,
                    content: update.content || section.content,
                    aiGenerated: true,
                  };
                }
                return section;
              }));
            }

            if (step.addSection) {
              setSections(prev => [...prev, {
                id: (prev.length + 1).toString(),
                title: step.addSection!.title,
                content: '',
                status: 'in-progress',
                aiGenerated: true,
                isCustom: true,
                canDelete: true,
              }]);
            }
          }, 1500);
        }

        if (step.sectionUpdates && !step.systemUpdate) {
          setTimeout(() => {
            setSections(prev => prev.map(section => {
              const update = step.sectionUpdates?.find((u: any) => u.id === section.id);
              if (update) {
                return {
                  ...section,
                  status: update.status || section.status,
                  content: update.content || section.content,
                  aiGenerated: true,
                };
              }
              return section;
            }));
          }, 1000);
        }
      }

      setConversationStep(prev => prev + 1);
    }, 1500);
  };

  const handleStartListening = async () => {
    setIsListening(true);
    
    try {
      // Start speech recognition IMMEDIATELY when button is pressed
      console.log('🎤 Starting speech recognition...');
      const transcript = await eventLabsService.speechToText();
      
      // If we get a transcript, process it
      if (transcript && transcript.trim().length > 0) {
        setIsListening(false);
        
        // Display user message
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: transcript,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);

        // 2. GPT-4o: Generate AI response
        console.log('💬 Step 2: Generating AI response...');
        const aiResponse = await openAIService.chat(transcript);

        // 3. TTS: Convert AI response to speech
        console.log('🔊 Step 3: Converting AI response to speech...');
        const audioUrl = await eventLabsService.textToSpeech(aiResponse);

        // Display AI message with audio
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
          audioUrl: audioUrl,
        };
        setMessages(prev => [...prev, assistantMessage]);

        // 4. Auto-play AI voice response
        console.log('▶️ Step 4: Playing AI voice response...');
        await eventLabsService.playAudio(audioUrl);

        console.log('✅ Complete voice conversation cycle finished');
      } else {
        // No transcript received, but speech recognition started
        console.log('⏱️ Waiting for speech...');
      }
    } catch (error: any) {
      console.error('❌ Speech recognition error:', error);
      setIsListening(false);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: error.message || '⚠️ Could not process voice conversation. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleStopListening = async () => {
    // Just stop the listening state
    // The speech recognition will handle stopping automatically
    console.log('🛑 Stop button clicked');
    setIsListening(false);
  };

  const handleSendMessage = (text: string) => {
    simulateUserResponse(text);
  };

  const handleUploadDocument = (file: File) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date(),
      analyzed: false,
    };
    setDocuments(prev => [...prev, newDoc]);

    setTimeout(() => {
      setDocuments(prev => prev.map(doc => 
        doc.id === newDoc.id ? { ...doc, analyzed: true } : doc
      ));
      
      const step = demoConversation[conversationStep];
      if (step && step.assistant) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: step.assistant,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);

        if (step.systemUpdate) {
          setTimeout(() => {
            const sysMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'system',
              content: step.systemUpdate!,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, sysMessage]);

            if (step.sectionUpdates) {
              setSections(prev => prev.map(section => {
                const update = step.sectionUpdates?.find((u: any) => u.id === section.id);
                if (update) {
                  return { ...section, ...update, aiGenerated: true };
                }
                return section;
              }));
            }
          }, 2000);
        }

        setConversationStep(prev => prev + 1);
      }
    }, 2000);
  };

  const handleSectionClick = (sectionId: string) => {
    console.log('Section clicked:', sectionId);
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
  };

  const handleAddSection = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: 'To add a custom section, just tell me via voice or text what section you want to add!\n\nFor example: "Add a section about elder involvement" or "Add a section for our timeline"',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handlePlayAudio = async (messageId: string) => {
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      // Generate audio from text
      const audioUrl = await eventLabsService.textToSpeech(message.content);
      
      // Play the audio
      await eventLabsService.playAudio(audioUrl);
      
      console.log('✅ Audio playback complete');
    } catch (error) {
      console.error('Failed to play audio:', error);
      
      // Show error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: '⚠️ Could not generate audio. Try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-stone-200 px-8 py-4">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="w-px h-6 bg-stone-300" />
            <h1 className="text-xl font-bold text-stone-900">Grant Proposal Builder</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onReview}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Review & Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="max-w-[1800px] mx-auto p-8">
        <div className="grid grid-cols-12 gap-6" style={{ height: 'calc(100vh - 180px)' }}>
          {/* Left: Checklist (30%) */}
          <div className="col-span-4">
            <Checklist
              sections={sections}
              onSectionClick={handleSectionClick}
              onDeleteSection={handleDeleteSection}
              onAddSection={handleAddSection}
            />
          </div>

          {/* Right: Voice Chat (70%) */}
          <div className="col-span-8">
            <VoiceChat
              messages={messages}
              isListening={isListening}
              documents={documents}
              onStartListening={handleStartListening}
              onStopListening={handleStopListening}
              onSendMessage={handleSendMessage}
              onUploadDocument={handleUploadDocument}
              onPlayAudio={handlePlayAudio}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
