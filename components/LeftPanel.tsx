import React from 'react';
import type { AppState, Mode, CreateFunction, EditFunction, AspectRatio } from '../types';
import { CREATE_FUNCTIONS, EDIT_FUNCTIONS, ASPECT_RATIOS } from '../constants';
import { FunctionCard } from './FunctionCard';
import { UploadArea } from './UploadArea';

interface LeftPanelProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  onGenerate: () => void;
}

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300 180"
    aria-labelledby="logo-title"
    role="img"
    className="w-48 mx-auto"
  >
    <title id="logo-title">Dominium Informática Logo</title>
    
    {/* Icon */}
    <g>
      {/* Monitor */}
      <g>
        {/* Screen */}
        <path d="M125 20 H225 V100 H125 Z" fill="#36A9E1" />
        {/* Yellow accent */}
        <path d="M225 100 C 190 100, 160 50, 125 45 V100 H225 Z" fill="#F7C434" />
        {/* Stand */}
        <rect x="165" y="100" width="20" height="10" fill="#36A9E1" />
        <rect x="150" y="110" width="50" height="7" rx="3" fill="#F7C434" />
      </g>
      
      {/* Pixels */}
      <g fill="#36A9E1">
        <rect x="110" y="15" width="22" height="22" rx="5" />
        <rect x="90" y="30" width="12" height="12" rx="3" />
        <rect x="135" y="40" width="10" height="10" rx="2" />
        <rect x="100" y="50" width="18" height="18" rx="4" />
        <rect x="75" y="50" width="15" height="15" rx="3" />
        <rect x="120" y="70" width="8" height="8" rx="2" />
        <rect x="95" y="75" width="14" height="14" rx="3" />
        <rect x="70" y="80" width="10" height="10" rx="2" />
        <rect x="110" y="90" width="9" height="9" rx="2" />
      </g>
    </g>

    {/* Text */}
    <text
      x="150"
      y="145"
      fontFamily="sans-serif"
      fontSize="24"
      fontWeight="bold"
      fill="white"
      textAnchor="middle"
      letterSpacing="2"
    >
      DOMINIUM
    </text>
    <text
      x="150"
      y="170"
      fontFamily="sans-serif"
      fontSize="24"
      fontWeight="bold"
      fill="#F7C434"
      textAnchor="middle"
      letterSpacing="1"
    >
      INFORMÁTICA
    </text>
  </svg>
);


export const LeftPanel: React.FC<LeftPanelProps> = ({ appState, setAppState, onGenerate }) => {
  const { mode, prompt, activeCreateFunction, activeEditFunction, showTwoImageUpload, isLoading, image1, image2, aspectRatio } = appState;

  const handleModeChange = (newMode: Mode) => {
    setAppState(prev => ({ ...prev, mode: newMode, showTwoImageUpload: false }));
  };

  const handleCreateFuncChange = (func: CreateFunction) => {
    setAppState(prev => ({ ...prev, activeCreateFunction: func }));
  };

  const handleEditFuncChange = (func: EditFunction) => {
    const selectedFunc = EDIT_FUNCTIONS.find(f => f.id === func);
    setAppState(prev => ({
      ...prev,
      activeEditFunction: func,
      showTwoImageUpload: !!selectedFunc?.requiresTwo,
    }));
  };
  
  const handleAspectRatioChange = (ratio: AspectRatio) => {
    setAppState(prev => ({ ...prev, aspectRatio: ratio }));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageKey: 'image1' | 'image2') => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setAppState(prev => ({ ...prev, [imageKey]: base64 }));
      } catch (error) {
        console.error("Error converting file to base64", error);
        setAppState(prev => ({ ...prev, error: "Failed to load image." }));
      }
    }
  };

  const isGenerateDisabled = isLoading || !prompt || (mode === 'edit' && !showTwoImageUpload && !image1) || (mode === 'edit' && showTwoImageUpload && (!image1 || !image2));

  return (
    <div className="left-panel lg:w-1/3 xl:w-1/4 bg-gray-800 p-6 flex flex-col h-full overflow-y-auto">
      <header className="mb-8 text-center">
        <Logo />
      </header>

      <div className="prompt-section">
        <div className="section-title text-gray-300 font-semibold mb-2">💭 Descreva sua ideia</div>
        <textarea
          id="prompt"
          className="prompt-input w-full bg-gray-700 border border-gray-600 rounded-lg p-3 h-32 resize-none text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
          placeholder="Descreva a imagem que você deseja criar..."
          value={prompt}
          onChange={(e) => setAppState(prev => ({ ...prev, prompt: e.target.value }))}
        />
      </div>

      <div className="mode-toggle mt-6 flex bg-gray-700 rounded-lg p-1">
        <button
          className={`mode-btn w-1/2 py-2 rounded-md transition-colors text-sm font-medium ${mode === 'create' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
          data-mode="create"
          onClick={() => handleModeChange('create')}
        >
          Criar
        </button>
        <button
          className={`mode-btn w-1/2 py-2 rounded-md transition-colors text-sm font-medium ${mode === 'edit' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
          data-mode="edit"
          onClick={() => handleModeChange('edit')}
        >
          Editar
        </button>
      </div>

      {mode === 'create' && (
        <>
          <div id="createFunctions" className="functions-section mt-6">
            <div className="functions-grid grid grid-cols-2 gap-3">
              {CREATE_FUNCTIONS.map(func => (
                <FunctionCard
                  key={func.id}
                  icon={func.icon}
                  name={func.name}
                  isActive={activeCreateFunction === func.id}
                  onClick={() => handleCreateFuncChange(func.id as CreateFunction)}
                />
              ))}
            </div>
          </div>
          <div className="aspect-ratio-section mt-6">
            <div className="section-title text-gray-300 font-semibold mb-2">📐 Proporção da Imagem</div>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map(ratio => (
                <button
                  key={ratio.value}
                  onClick={() => handleAspectRatioChange(ratio.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    aspectRatio === ratio.value 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {mode === 'edit' && !showTwoImageUpload && (
        <div id="editFunctions" className="functions-section mt-6">
          <div className="functions-grid grid grid-cols-2 gap-3">
            {EDIT_FUNCTIONS.map(func => (
              <FunctionCard
                key={func.id}
                icon={func.icon}
                name={func.name}
                isActive={activeEditFunction === func.id}
                onClick={() => handleEditFuncChange(func.id as EditFunction)}
              />
            ))}
          </div>
          <div className="dynamic-content mt-4">
            <UploadArea id="uploadArea" imagePreview={image1} onImageUpload={(e) => handleImageUpload(e, 'image1')} />
          </div>
        </div>
      )}
      
      {mode === 'edit' && showTwoImageUpload && (
         <div id="twoImagesSection" className="functions-section mt-6 flex flex-col gap-4">
            <div className="section-title text-gray-300 font-semibold">📸 Duas Imagens Necessárias</div>
            <UploadArea id="uploadArea1" imagePreview={image1} onImageUpload={(e) => handleImageUpload(e, 'image1')} title="Primeira Imagem" />
            <UploadArea id="uploadArea2" imagePreview={image2} onImageUpload={(e) => handleImageUpload(e, 'image2')} title="Segunda Imagem" />
            <button className="back-btn text-purple-400 hover:text-purple-300 transition text-sm self-start mt-2" onClick={() => setAppState(prev => ({ ...prev, showTwoImageUpload: false }))}>
                ← Voltar para Edição
            </button>
         </div>
      )}


      <div className="mt-auto pt-6">
        <button
          id="generateBtn"
          className="generate-btn w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onGenerate}
          disabled={isGenerateDisabled}
        >
          {isLoading ? (
            <div className="spinner w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <span className="btn-text text-lg">🚀 Gerar Imagem</span>
          )}
        </button>
        {appState.error && <p className="text-red-400 text-center mt-3 text-sm">{appState.error}</p>}
      </div>
    </div>
  );
};
