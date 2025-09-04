
import React from 'react';
import type { AppState } from '../types';

interface RightPanelProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const RightPanel: React.FC<RightPanelProps> = ({ appState, setAppState }) => {
  const { isLoading, generatedImage } = appState;

  const editCurrentImage = () => {
    if (!generatedImage) return;
    setAppState(prev => ({
      ...prev,
      mode: 'edit',
      image1: prev.generatedImage,
      image2: null,
      generatedImage: null,
      showTwoImageUpload: false,
      activeEditFunction: 'add-remove'
    }));
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'ai-generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div id="loadingContainer" className="loading-container flex flex-col items-center justify-center h-full text-center">
          <div className="loading-spinner w-16 h-16 border-8 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
          <div className="loading-text text-gray-300 mt-6 text-xl">Gerando sua imagem...</div>
        </div>
      );
    }
    if (generatedImage) {
      return (
        <div id="imageContainer" className="image-container relative w-full h-full flex items-center justify-center group">
          <img id="generatedImage" src={generatedImage} alt="Generated Art" className="generated-image max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
          <div className="image-actions absolute bottom-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 p-2 rounded-lg">
            <button className="action-btn w-12 h-12 bg-gray-700 hover:bg-purple-600 rounded-full flex items-center justify-center text-2xl transition-colors" onClick={editCurrentImage} title="Editar">✏️</button>
            <button className="action-btn w-12 h-12 bg-gray-700 hover:bg-purple-600 rounded-full flex items-center justify-center text-2xl transition-colors" onClick={downloadImage} title="Download">💾</button>
          </div>
        </div>
      );
    }
    return (
      <div id="resultPlaceholder" className="result-placeholder flex flex-col items-center justify-center h-full text-center text-gray-500">
        <div className="result-placeholder-icon text-8xl mb-4">🎨</div>
        <div className="text-2xl">Sua obra de arte aparecerá aqui</div>
      </div>
    );
  };
  
  return (
    <div className="right-panel hidden lg:flex lg:w-2/3 xl:w-3/4 bg-gray-900 p-8 items-center justify-center h-full">
      {renderContent()}
    </div>
  );
};
