
import { GoogleGenAI, Modality } from "@google/genai";
import type { AppState } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function dataUrlToGeminiPart(dataUrl: string) {
    const [header, data] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1];
    if (!mimeType || !data) {
        throw new Error("Invalid data URL format");
    }
    return {
        inlineData: {
            mimeType,
            data,
        },
    };
}

const enhancePrompt = (prompt: string, func: string): string => {
    switch(func) {
        case 'sticker': return `a die-cut sticker of ${prompt}, vibrant colors, high contrast, white background, vector art style`;
        case 'text': return `a clean, modern, professional logo with the text "${prompt}", minimalist vector style, on a plain white background`;
        case 'comic': return `a comic book style panel illustrating "${prompt}", dynamic action, bold lines, vibrant halftones, classic comic art`;
        case 'add-remove': return `For the provided image, please follow this instruction: ${prompt}. Return only the modified image.`;
        case 'retouch': return `Perform a professional retouch on the provided image based on this request: "${prompt}". Focus on improving quality, lighting, and detail. Return only the modified image.`;
        case 'style': return `Apply the following artistic style to the provided image: "${prompt}". Maintain the original subject matter but transform its visual style. Return only the modified image.`;
        case 'compose': return `Seamlessly combine the two provided images. Use the following description as a guide for the composition: "${prompt}". The final image should be a cohesive single scene. Return only the modified image.`;
        default: return prompt;
    }
}

export const generateAiImage = async (state: AppState): Promise<string> => {
    try {
        if (state.mode === 'create') {
            const finalPrompt = enhancePrompt(state.prompt, state.activeCreateFunction);
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: finalPrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                    aspectRatio: state.aspectRatio,
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
            throw new Error("No images were generated.");
        } else { // Edit mode
            if (!state.image1) throw new Error("An image is required for editing.");
            
            const finalPrompt = enhancePrompt(state.prompt, state.activeEditFunction);
            const imageParts = [dataUrlToGeminiPart(state.image1)];
            if (state.showTwoImageUpload && state.image2) {
                imageParts.push(dataUrlToGeminiPart(state.image2));
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: {
                    parts: [
                        ...imageParts,
                        { text: finalPrompt }
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
            if (imagePart?.inlineData) {
                const { data, mimeType } = imagePart.inlineData;
                return `data:${mimeType};base64,${data}`;
            }
            throw new Error("Image editing failed to produce a result.");
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the AI.");
    }
};