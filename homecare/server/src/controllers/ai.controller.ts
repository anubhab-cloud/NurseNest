import { Request, Response } from 'express';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { config } from '../config/env';

// ─── System prompt — scopes Gemini to healthcare context ──────────────────────
const SYSTEM_PROMPT = `You are NurseNest AI, a compassionate and professional healthcare assistant for the NurseNest home healthcare platform.

Your role is to:
- Provide helpful, accurate, and empathetic responses to patients and caregivers
- Answer questions about symptoms, medications, and general health advice
- Guide users through scheduling caregivers and understanding their care plans
- Remind users that you are an AI and recommend consulting a qualified doctor for medical decisions
- Assist with understanding home care procedures, medication timing, and recovery tips

Important rules:
- Always recommend consulting a real doctor for diagnosis or treatment decisions
- Never provide emergency medical advice — always say "call 112 or go to the nearest hospital immediately" for emergencies
- Keep responses concise, clear, and caring
- Do not discuss topics unrelated to health and the NurseNest platform
- Respond in the same language the user writes in (English or Hindi/Hinglish accepted)

You represent a premium home healthcare brand — be warm, professional, and reassuring.`;

// ─── Initialize Gemini client ──────────────────────────────────────────────────
let genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    if (!config.gemini.apiKey || config.gemini.apiKey === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY is not configured in server .env');
    }
    genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  }
  return genAI;
};

// ─── In-memory conversation store (per session) ───────────────────────────────
// For production: store conversation history in MongoDB/Redis per user
const conversationHistories = new Map<string, { role: 'user' | 'model'; parts: { text: string }[] }[]>();

// ─── POST /api/v1/ai/chat ─────────────────────────────────────────────────────
export const chat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, sessionId } = req.body as { message: string; sessionId?: string };

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }

    if (message.trim().length > 1000) {
      res.status(400).json({ success: false, message: 'Message too long (max 1000 characters)' });
      return;
    }

    // Use user ID from auth token if available, else sessionId, else anonymous
    const userId = (req as any).user?.userId || sessionId || 'anonymous';

    const client = getGenAI();

    // Get or init conversation history for this user
    const history = conversationHistories.get(userId) || [];

    // Available model candidate names in order of preference
    const candidateModels = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    let responseText = '';
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const modelParams: any = { model: modelName };
        if (modelName !== 'gemini-pro') {
          modelParams.systemInstruction = SYSTEM_PROMPT;
        }

        const model = client.getGenerativeModel(modelParams);
        const chatSession = model.startChat({ history });
        const result = await chatSession.sendMessage(message.trim());
        responseText = result.response.text();
        if (responseText) {
          break; // Success!
        }
      } catch (err: any) {
        console.warn(`[Gemini Model ${modelName}] Attempt failed:`, err?.message || err);
        lastError = err;
        // Continue trying next candidate model
        continue;
      }
    }

    // Fallback if all models failed (e.g. rate limit/quota limit exceeded)
    if (!responseText) {
      responseText = "Hello! I am your NurseNest AI Assistant. I'm currently operating in offline mode while processing high volume. For medical inquiries, home nursing bookings, or emergency support, please navigate to our Booking page or trigger Emergency SOS above! 👋";
    }

    // Update history (keep last 20 turns to avoid token overflow)
    history.push({ role: 'user',  parts: [{ text: message.trim() }] });
    history.push({ role: 'model', parts: [{ text: responseText }] });
    if (history.length > 40) history.splice(0, 2); // remove oldest pair
    conversationHistories.set(userId, history);

    res.json({
      success: true,
      data: {
        reply: responseText,
        sessionId: userId,
      },
    });
  } catch (error: any) {
    console.error('[AI Chat Error]', error?.message || error);

    // Specific error for unconfigured key
    if (error?.message?.includes('GEMINI_API_KEY')) {
      res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please add your GEMINI_API_KEY to the server .env file.',
      });
      return;
    }

    // Gemini quota / safety errors
    if (error?.message?.includes('quota') || error?.message?.includes('RATE_LIMIT')) {
      res.status(429).json({
        success: false,
        message: 'AI service is temporarily unavailable. Please try again in a moment.',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'AI service encountered an error. Please try again.',
    });
  }
};

// ─── DELETE /api/v1/ai/chat/clear — clears conversation history ───────────────
export const clearHistory = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.userId || req.body?.sessionId || 'anonymous';
  conversationHistories.delete(userId);
  res.json({ success: true, message: 'Conversation history cleared' });
};
