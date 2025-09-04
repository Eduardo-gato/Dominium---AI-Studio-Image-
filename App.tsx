
import React, { useState, useCallback } from 'react';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { MobileModal } from './components/MobileModal';
import { generateAiImage } from './services/geminiService';
import type { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    prompt: '',
    mode: 'create',
    activeCreateFunction: 'free',
    activeEditFunction: 'add-remove',
    aspectRatio: '1:1',
    image1: null,
    image2: null,
    generatedImage: null,
    isLoading: false,
    error: null,
    showTwoImageUpload: false,
    isModalOpen: false,
  });

  const handleGenerate = useCallback(async () => {
    setAppState(prev => ({ ...prev, isLoading: true, error: null, generatedImage: null }));
    try {
      const imageDataUrl = await generateAiImage(appState);
      setAppState(prev => ({ 
        ...prev, 
        isLoading: false, 
        generatedImage: imageDataUrl,
        isModalOpen: window.innerWidth < 1024,
      }));
    } catch (err) {
      console.error(err);
      setAppState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'An unknown error occurred.' 
      }));
    }
  }, [appState]);

  return (
    <div className="bg-gray-900 text-white font-sans antialiased">
      <main className="container mx-auto p-4 lg:p-0 lg:flex lg:h-screen lg:max-w-none">
        <LeftPanel appState={appState} setAppState={setAppState} onGenerate={handleGenerate} />
        <RightPanel appState={appState} setAppState={setAppState} />
        <MobileModal appState={appState} setAppState={setAppState} />
      </main>
    </div>
  );
};

export default App;