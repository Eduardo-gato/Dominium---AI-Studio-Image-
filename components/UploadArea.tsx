import React, { useRef } from 'react';

interface UploadAreaProps {
  id: string;
  imagePreview: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title?: string;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ id, imagePreview, onImageUpload, title = "Clique ou arraste uma imagem" }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const containerClasses = `
    upload-area relative w-full aspect-video bg-gray-700 rounded-lg flex items-center justify-center text-center text-gray-400 cursor-pointer transition-colors
    ${imagePreview 
      ? 'border-2 border-solid border-purple-500' 
      : 'border-2 border-dashed border-gray-500 hover:border-purple-500 hover:bg-gray-600'}
  `;
  
  return (
    <div 
        className={containerClasses.trim()}
        onClick={handleClick}
    >
      {imagePreview ? (
        <>
          <img src={imagePreview} alt="Preview" className="image-preview absolute inset-0 w-full h-full object-cover rounded-lg" />
          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-lg leading-none">
            ✓
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
            <div className="text-4xl">📁</div>
            <div className="mt-2 font-semibold">{title}</div>
            <div className="upload-text text-xs text-gray-500 mt-1">{id === 'uploadArea' ? 'PNG, JPG, WebP (máx. 10MB)' : 'Clique para selecionar'}</div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        id={id.replace('Area', 'Upload')}
        className="hidden"
        accept="image/*"
        onChange={onImageUpload}
      />
    </div>
  );
};
