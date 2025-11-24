import { GoogleGenAI, Modality } from "@google/genai";
import { MODEL_CHAT, MODEL_IMAGE_EDIT, MODEL_IMAGE_GEN } from '../constants';
import { ScriptInputs } from '../types';

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

// -- Viral Script Generator Service --
export const generateViralScript = async (inputs: ScriptInputs): Promise<string> => {
  // Using gemini-3-pro-preview for complex reasoning and creative writing
  const model = MODEL_CHAT; 
  
  const prompt = `
Act as a Viral YouTube Shorts Scriptwriter and Content Strategist. You specialize in creating high-retention, addictive Hinglish content (Conversational Hindi written in English script + English terms) for the Indian market.

I will provide you with the Topic, Niche, Audience, Tone, Duration, and Style.

Your goal is to generate a complete Shorts production plan with 3 DISTINCT VARIATIONS based on the following inputs:

👉 **USER INPUTS:**
- **Topic:** ${inputs.topic}
- **Niche:** ${inputs.niche}
- **Target Audience:** ${inputs.audience}
- **Tone:** ${inputs.tone}
- **Duration:** ${inputs.duration} seconds
- **Style Type:** ${inputs.style}

---

### 🚀 OUTPUT REQUIREMENTS (Strictly Follow These Rules)

**1. STRUCTURE (Scene-by-Scene Table):**
For each variation, you **MUST** provide a Markdown table with the following columns: **Time**, **Visual Scene / B-Roll**, **Script (Hinglish)**, **On-Screen Text**.

The table must cover these exact segments:
- **00-02s (Hook):** Ultra-shocking visual or curiosity gap.
- **03-18s (Body):** Fast-paced micro-points/storytelling.
- **18-22s (Peak):** The emotional payoff or punchline.
- **22-30s (CTA):** Natural call to action.

**CRITICAL:** You must suggest specific Visual B-Roll footage for **EACH** of these time segments in the table.

**2. METADATA (For each variation):**
- **Audio/Music:** Suggest the specific mood.
- **Voice Tone:** How should the voiceover sound?

**3. ADDITIONAL ASSETS (One set for the whole topic):**
- **Auto Hashtags:** Generate exactly 10-15 SEO-optimized hashtags mixed with trending tags based on the topic/niche.
- **Thumbnail Text:** Generate exactly 5 options (2-4 words max, punchy, clickbaity).
- **Comment Bait:** 1 specific question to pin in the comments.

---

### 📝 GENERATE 3 VARIATIONS:

**Variation 1: High-Energy / Viral Style**
(Fast cuts, loud music, aggressive hook)

**Variation 2: Aesthetic / Storytelling Style**
(Slower pacing, emotional connection, cinematic visuals)

**Variation 3: Humor / Savage Style**
(Uses memes, sarcasm, funny punchlines, relatable pain points)

---

**IMPORTANT LANGUAGE RULE:** 
Write the script in **Natural Hinglish**.
*Bad Example:* "Yaha dekho" 
*Good Example:* "Agar tum bhi ye mistake kar rahe ho, toh ruk jao!"
`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });

  return response.text || "Failed to generate script.";
};