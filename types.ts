
export type Mode = 'create' | 'edit';
export type CreateFunction = 'free' | 'sticker' | 'text' | 'comic';
export type EditFunction = 'add-remove' | 'retouch' | 'style' | 'compose';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface AppState {
  prompt: string;
  mode: Mode;
  activeCreateFunction: CreateFunction;
  activeEditFunction: EditFunction;
  aspectRatio: AspectRatio;
  image1: string | null;
  image2: string | null;
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  showTwoImageUpload: boolean;
  isModalOpen: boolean;
}

export interface FunctionCardData {
  id: CreateFunction | EditFunction;
  icon: string;
  name: string;
  requiresTwo?: boolean;
}

export interface AspectRatioData {
    value: AspectRatio;
    label: string;
}
