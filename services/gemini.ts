import { GoogleGenAI, Modality } from "@google/genai";
import { MODEL_CHAT, MODEL_IMAGE_EDIT, MODEL_IMAGE_GEN } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// -- Chat Service --
export const createChatSession = () => {
  return ai.chats.create({
    model: MODEL_CHAT,
    config: {
      systemInstruction: "You are the Wetube Assistant. You help users navigate the platform, suggest videos, and answer questions about content creation. Be helpful, concise, and friendly.",
    }
  });
};

// -- Image Generation Service --
export const generateThumbnail = async (prompt: string): Promise<string> => {
  // Using imagen-4.0-generate-001
  const response = await ai.models.generateImages({
    model: MODEL_IMAGE_GEN,
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png',
      aspectRatio: '16:9', // Perfect for thumbnails
    },
  });

  const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
  if (!base64ImageBytes) {
    throw new Error("No image generated");
  }
  return `data:image/png;base64,${base64ImageBytes}`;
};

// -- Image Editing Service (Nano Banana) --
export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
  // Using gemini-2.5-flash-image
  // The input base64 string might contain the data prefix, we need to strip it if present for the SDK usage sometimes,
  // but usually passing the raw data part is safer.
  const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
  const mimeType = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,/)?.[1] || 'image/png';

  const response = await ai.models.generateContent({
    model: MODEL_IMAGE_EDIT,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        },
        {
          text: prompt
        }
      ]
    },
    config: {
      responseModalities: [Modality.IMAGE], // Critical for image output
    }
  });

  // Parse response for image
  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && part.inlineData) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  
  throw new Error("No edited image returned");
};
