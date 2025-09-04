import type { FunctionCardData, AspectRatioData } from './types';

export const CREATE_FUNCTIONS: FunctionCardData[] = [
  { id: 'free', icon: '✨', name: 'Prompt' },
  { id: 'sticker', icon: '🏷️', name: 'Adesivos' },
  { id: 'text', icon: '📝', name: 'Logo' },
  { id: 'comic', icon: '💭', name: 'HQ' },
];

export const EDIT_FUNCTIONS: FunctionCardData[] = [
  { id: 'add-remove', icon: '➕', name: 'Adicionar' },
  { id: 'retouch', icon: '🎯', name: 'Retoque' },
  { id: 'style', icon: '🎨', name: 'Estilo' },
  { id: 'compose', icon: '🖼️', name: 'Unir', requiresTwo: true },
];

export const ASPECT_RATIOS: AspectRatioData[] = [
    { value: '1:1', label: '1:1' },
    { value: '16:9', label: '16:9' },
    { value: '9:16', label: '9:16' },
    { value: '4:3', label: '4:3' },
    { value: '3:4', label: '3:4' },
];