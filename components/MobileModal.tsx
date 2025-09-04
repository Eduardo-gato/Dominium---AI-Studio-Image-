
import React from 'react';
import type { AppState } from '../types';

interface MobileModalProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const MobileModal: React.FC<MobileModalProps> = ({ appState, setAppState }) => {
  const { isModalOpen, generatedImage } = appState;

  if (!isModalOpen || !generatedImage) return null;

  const closeModal = () => setAppState(prev => ({...prev, isModalOpen: false}));

  const editFromModal = () => {
    setAppState(prev => ({
      ...prev,
      mode: 'edit',
      image1: prev.generatedImage,
      image2: null,
      generatedImage: null,
      showTwoImageUpload: false,
      activeEditFunction: 'add-remove',
      isModalOpen: false
    }));
  };

  const downloadFromModal = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'ai-generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const newImageFromModal = () => {
     setAppState(prev => ({
      ...prev,
      prompt: '',
      generatedImage: null,
      image1: null,
      image2: null,
      isModalOpen: false
    }));
  };

  return (
    <div id="mobileModal" className="mobile-modal fixed inset-0 bg-black/80 z-50 flex items-center justify-center lg:hidden" onClick={closeModal}>
      <div className="modal-content bg-gray-800 rounded-lg p-4 m-4 w-full max-w-sm flex flex-col gap-4" onClick={e => e.stopPropagation()}>
        <div className="relative w-full aspect-square">
            <img id="modalImage" src={generatedImage} alt="Generated Art" className="modal-image w-full h-full object-contain rounded-md" />
        </div>
        <div className="modal-actions grid grid-cols-3 gap-2">
            <button className="modal-btn edit bg-gray-700 p-3 rounded-lg flex flex-col items-center gap-1 text-sm" onClick={editFromModal}>
                <span>✏️</span>
                <span>Editar</span>
            </button>
            <button className="modal-btn download bg-gray-700 p-3 rounded-lg flex flex-col items-center gap-1 text-sm" onClick={downloadFromModal}>
                <span>💾</span>
                <span>Salvar</span>
            </button>
            <button className="modal-btn new bg-purple-600 p-3 rounded-lg flex flex-col items-center gap-1 text-sm" onClick={newImageFromModal}>
                <span>✨</span>
                <span>Nova</span>
            </button>
        </div>
      </div>
    </div>
  );
};
