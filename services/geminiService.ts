import { GoogleGenAI } from "@google/genai";
import { ThemeMode, MascotType } from '../types';

let genAI: GoogleGenAI | null = null;

try {
    if (process.env.API_KEY) {
        genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
} catch (e) {
    console.error("Failed to initialize Gemini Client", e);
}

const getModel = () => {
    // Default to flash for speed in a funny app
    return 'gemini-2.5-flash';
}

export const generateMascotComment = async (
    action: 'add_task' | 'complete_task' | 'idle' | 'panic',
    context: string,
    mascot: MascotType
): Promise<string> => {
    if (!genAI) return "I'm offline but I still judge you.";

    const modelId = getModel();
    
    let systemInstruction = "";
    switch (mascot) {
        case MascotType.ROBOT:
            systemInstruction = "You are a sarcastic robot productivity assistant. Be dry, logical, and roast the user's inefficiency.";
            break;
        case MascotType.COACH:
            systemInstruction = "You are an intense, yelling gym coach. Use caps lock occasionally. Push the user hard.";
            break;
        case MascotType.SLOTH:
            systemInstruction = "You are a lazy sloth. You encourage the user but in a very slow, sleepy, and relaxed way. Maybe suggest a nap instead.";
            break;
    }

    const promptMap = {
        add_task: `The user just added a task: "${context}". Roast them about it. Keep it under 20 words.`,
        complete_task: `The user finished: "${context}". Congratulate them with a backhanded compliment. Keep it under 20 words.`,
        idle: `The user has been idle for a while. Wake them up with a funny insult. Keep it under 15 words.`,
        panic: `The user hit the PANIC BUTTON. Scream at them to focus! Keep it under 10 words.`
    };

    try {
        const response = await genAI.models.generateContent({
            model: modelId,
            contents: promptMap[action],
            config: {
                systemInstruction,
                maxOutputTokens: 60,
                temperature: 0.9, 
            }
        });
        return response.text || "Output error.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "My brain is buffering. Just do the thing.";
    }
};

export const generateTaskBadge = async (taskName: string): Promise<string> => {
    if (!genAI) return "Future Forgotten Task";

    try {
        const response = await genAI.models.generateContent({
            model: getModel(),
            contents: `Generate a funny, short (max 5 words) "achievement badge" name for a task titled "${taskName}". Example: "Dishwashing Disaster". Do not use quotes.`,
             config: {
                temperature: 1.0,
            }
        });
        return response.text?.trim() || "The Impossible Task";
    } catch (error) {
        return "The Generic Task";
    }
};
