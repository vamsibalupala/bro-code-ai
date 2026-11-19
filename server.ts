import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_NAME = 'gemini-4-hydrogen';

function getAiClient(): GoogleGenAI {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getPersonalityPrompt(personality: string): string {
  switch (personality) {
    case 'concise':
      return 'Be ultra-concise, sharp, tactical, and direct (1-2 sentences unless code/lists are needed).';
    case 'witty':
      return 'Be charismatic, subtly witty like a loyal tactical AI wingman ("Bro"), sharp, helpful, and natural without being cheesy.';
    default:
      return 'Be clear, intelligent, calm, and structured—like a high-precision personal AI operating system named Bro.';
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'bro-core' });
  });

  // 1. BRO Conversational Chat & Voice HUD Intelligence
  app.post('/api/bro/chat', async (req, res) => {
    try {
      const { message, history = [], personality = 'balanced', hermesContext, mode = 'chat' } = req.body ?? {};
      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Message text is required.' });
        return;
      }

      const ai = getAiClient();
      const contextBlock = hermesContext
        ? `\n\n[HERMES MEMORY CONTEXT]\nSOUL:\n${hermesContext.soul || ''}\nUSER:\n${hermesContext.user || ''}\nAGENT:\n${hermesContext.agent || ''}`
        : '';

      const hudInstruction = mode === 'bro'
        ? 'You are responding in live voice HUD mode. Keep your response spoken-friendly, crisp, and under 3 sentences unless asked for detail.'
        : 'Format responses cleanly with concise markdown where helpful.';

      const systemInstruction = `You are BRO, an autonomous local-first personal AI assistant and tactical operating system. ${getPersonalityPrompt(personality)} ${hudInstruction}${contextBlock}`;

      const contents = [
        ...history
          .slice(-12)
          .filter((m: { role?: string; text?: string }) => m.text && (m.role === 'user' || m.role === 'agent'))
          .map((m: { role: string; text: string }) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          })),
        { role: 'user', parts: [{ text: message.trim() }] },
      ];

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents,
        config: {
          systemInstruction,
        },
      });

      res.json({
        reply: (response.text ?? '').trim() || 'Ready for your next directive.',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to reach Bro AI core.';
      res.status(500).json({ error: message });
    }
  });

  // 2. BRO Autonomous Agent (Observe-Think-Act multi-step planner)
  app.post('/api/bro/agent', async (req, res) => {
    try {
      const { goal, personality = 'balanced', hermesContext } = req.body ?? {};
      if (!goal || typeof goal !== 'string' || !goal.trim()) {
        res.status(400).json({ error: 'Goal description is required.' });
        return;
      }

      const ai = getAiClient();
      const systemInstruction = `You are BRO's Autonomous Observe-Think-Act execution engine. ${getPersonalityPrompt(personality)}
Decompose the user's goal into 3 to 5 clear, realistic execution steps (observing context, routing tools, executing actions, verifying completion).
If the goal implies creating a todo item, calendar event, or note, also populate createdTodos, createdEvents, or createdNotes.
Context:\n${hermesContext?.user || ''}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Execute autonomous task: ${goal.trim()}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.INTEGER },
                    action: { type: Type.STRING },
                    detail: { type: Type.STRING },
                  },
                },
              },
              summary: { type: Type.STRING },
              createdTodos: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              createdEvents: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    time: { type: Type.STRING },
                  },
                },
              },
              createdNotes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Autonomous agent execution failed.';
      res.status(500).json({ error: message });
    }
  });

  // 3. Multi-Task Decoupler ("Chaotic Brain Dump" Parallel Engine)
  app.post('/api/bro/brain-dump', async (req, res) => {
    try {
      const { dumpText } = req.body ?? {};
      if (!dumpText || typeof dumpText !== 'string' || !dumpText.trim()) {
        res.status(400).json({ error: 'Brain dump text is required.' });
        return;
      }

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Deconstruct this compound brain dump into discrete parallel atomic tasks and compute exact results (including any math calculations, drafts, reminders, todos, notes, or device hardware toggles): "${dumpText.trim()}"`,
        config: {
          systemInstruction:
            'You are BRO Multi-Task Decoupler. Split rambling compound requests into clean atomic tasks, solve calculations accurately, draft messages, and categorize each task into one of: reminder, todo, note, message, calculation, hardware, search.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    title: { type: Type.STRING },
                    result: { type: Type.STRING },
                  },
                },
              },
              summary: { type: Type.STRING },
              todos: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              events: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    time: { type: Type.STRING },
                  },
                },
              },
              notes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Multi-task decoupler failed.';
      res.status(500).json({ error: message });
    }
  });

  // 4. Hermes Self-Evolution Engine (Updates SOUL.md, USER.md, AGENT.md)
  app.post('/api/bro/evolve', async (req, res) => {
    try {
      const { currentContext, recentTranscripts = [] } = req.body ?? {};
      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Current Hermes Context:\nSOUL.md:\n${currentContext?.soul || ''}\n\nUSER.md:\n${currentContext?.user || ''}\n\nAGENT.md:\n${currentContext?.agent || ''}\n\nRecent Interactions:\n${JSON.stringify(recentTranscripts.slice(-15))}`,
        config: {
          systemInstruction:
            'You are BRO Hermes Self-Evolution Engine. Synthesize concise, high-signal markdown updates to SOUL.md, USER.md, and AGENT.md reflecting user habits, preferences, and workflows learned from recent interactions. Return updated markdown and a 1-sentence executive briefing.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              soul: { type: Type.STRING },
              user: { type: Type.STRING },
              agent: { type: Type.STRING },
              briefing: { type: Type.STRING },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Hermes self-evolution failed.';
      res.status(500).json({ error: message });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bro server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Bro server:', err);
  process.exit(1);
});
