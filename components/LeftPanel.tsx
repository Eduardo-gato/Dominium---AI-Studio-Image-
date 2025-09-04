
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
      <header>
        <h1 className="panel-title text-3xl font-bold text-white">🎨 AI Image Studio</h1>
        <p className="panel-subtitle text-gray-400 mt-1">Gerador profissional de imagens</p>
      </header>

      <div className="prompt-section mt-8">
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