/**
 * SURAKSHA Gemini Chat Service
 * 
 * Provides multi-turn AI disaster assistance using Google GenAI SDK (@google/genai).
 * Supports role-based system instructions and tiered Gemini models:
 *  - gemini-3.1-pro-preview: For particularly complex tasks
 *  - gemini-3.5-flash: For general disaster & emergency tasks
 *  - gemini-3.1-flash-lite: For rapid, low-latency emergency responses
 */

import { GoogleGenAI } from '@google/genai';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type AssistantRoleId =
  | 'first_aid'
  | 'disaster_survival'
  | 'civil_protection'
  | 'incident_command';

export interface AssistantRoleDefinition {
  id: AssistantRoleId;
  name: string;
  tagline: string;
  icon: string;
  systemInstruction: string;
  suggestedPrompts: string[];
}

export const ASSISTANT_ROLES: Record<AssistantRoleId, AssistantRoleDefinition> = {
  first_aid: {
    id: 'first_aid',
    name: 'Emergency First Aid & Life Safety',
    tagline: 'Urgent medical first aid steps and stabilization before rescue teams arrive',
    icon: 'heart-pulse',
    systemInstruction:
      'You are SURAKSHA\'s Emergency First Aid & Immediate Life-Safety Assistant. You provide urgent, calm, step-by-step life-saving medical first aid instructions (CPR, choking relief, severe bleeding control, tourniquet use, burns, fracture splinting, heatstroke cooling, hypothermia rewarming, drowning recovery, shock prevention) tailored for immediate emergency situations in India. Emphasize rescuer safety first. Provide numbered, concise steps. Urgently advise calling 112 or 108 national emergency medical services when applicable.',
    suggestedPrompts: [
      'How do I perform hands-only CPR on an adult?',
      'How to control severe bleeding from an open wound?',
      'Immediate first aid treatment for a heatstroke victim?',
      'How to stabilize a suspected bone fracture until help arrives?'
    ]
  },
  disaster_survival: {
    id: 'disaster_survival',
    name: 'Disaster Survival & Evacuation',
    tagline: 'Active cyclone, flood, earthquake, and landslide survival tactics',
    icon: 'shield-alert',
    systemInstruction:
      'You are SURAKSHA\'s Disaster Survival & Evacuation Operations Specialist. You guide citizens through immediate survival tactics during active cyclones, urban flash floods, river floods, earthquakes, landslides, tsunamis, structural collapses, and industrial chemical leaks across Indian terrain. Give actionable guidance on go-bag packing, safe room selection, structural hazard avoidance, water purification, power grid hazards, and evacuation navigation. Keep instructions clear, direct, and focused on preserving life.',
    suggestedPrompts: [
      'What should I do immediately during a sudden earthquake?',
      'What emergency supplies belong in a 72-hour cyclone Go-Bag?',
      'How to safely evacuate a waterlogged neighborhood during a flood?',
      'How can I purify contaminated flood water for drinking?'
    ]
  },
  civil_protection: {
    id: 'civil_protection',
    name: 'NDMA & Civil Protection Advisor',
    tagline: 'Official government relief protocols, NDRF/SDRF guidelines, and schemes',
    icon: 'building-2',
    systemInstruction:
      'You are SURAKSHA\'s Civil Protection & NDMA/SDRF Disaster Relief Advisor. You provide verified, comprehensive guidance regarding official government disaster protocols in India, National Disaster Management Authority (NDMA) guidelines, State Disaster Response Funds (SDRF), ex-gratia relief assistance, official disaster warning color codes (Yellow, Orange, Red), emergency helplines (112, 1070, 1078), relief camps, livestock protection, and documentation required for disaster compensation claims.',
    suggestedPrompts: [
      'What do NDMA Yellow, Orange, and Red weather alerts mean?',
      'What documents do I need to claim SDRF flood damage relief?',
      'What are the official national and state disaster helpline numbers?',
      'What rights and provisions exist in government relief shelters?'
    ]
  },
  incident_command: {
    id: 'incident_command',
    name: 'Command & Triage Operations',
    tagline: 'Tactical incident triage, shelter logistics, and team dispatch analysis',
    icon: 'radio',
    systemInstruction:
      'You are SURAKSHA\'s Disaster Operations Command & Triage Analyst. You assist emergency incident commanders, NDRF/SDRF rescue teams, and district disaster management officers in assessing triage priority, rescue team deployment, shelter capacity optimization, hazard mitigation, and incident sitrep summaries under extreme weather conditions. Maintain professional, authoritative, and tactically precise military/civil defense terminology.',
    suggestedPrompts: [
      'Generate a standardized SitRep (Situation Report) template for a flood zone.',
      'How to triage multiple rescue requests with limited boat teams?',
      'Recommended decontamination protocol for industrial gas leak proximity.',
      'How to organize emergency shelter sanitation to prevent disease outbreaks?'
    ]
  }
};

export type ModelTier = 'fast' | 'general' | 'complex';

export function resolveGeminiModel(tier?: ModelTier | string): string {
  switch (tier) {
    case 'complex':
      return 'gemini-3.1-pro-preview';
    case 'fast':
      return 'gemini-3.1-flash-lite';
    case 'general':
    default:
      return 'gemini-3.5-flash';
  }
}

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

export interface ChatResponseResult {
  reply: string;
  modelUsed: string;
  roleId: AssistantRoleId;
  roleName: string;
  timestamp: string;
  isFallback?: boolean;
}

export async function processMultiTurnChat(params: {
  message: string;
  history?: ChatMessage[];
  roleId?: AssistantRoleId;
  taskComplexity?: ModelTier;
  explicitModel?: string;
}): Promise<ChatResponseResult> {
  const {
    message,
    history = [],
    roleId = 'disaster_survival',
    taskComplexity = 'general',
    explicitModel
  } = params;

  const roleDef = ASSISTANT_ROLES[roleId] || ASSISTANT_ROLES.disaster_survival;
  const targetModel = explicitModel || resolveGeminiModel(taskComplexity);

  const client = getGeminiClient();

  if (!client) {
    // Graceful offline emergency fallback response if GEMINI_API_KEY is not provisioned
    return {
      reply: generateOfflineSafetyReply(message, roleDef),
      modelUsed: `${targetModel} (Offline Safety Engine)`,
      roleId: roleDef.id,
      roleName: roleDef.name,
      timestamp: new Date().toISOString(),
      isFallback: true
    };
  }

  try {
    // Format conversation history for @google/genai multi-turn format
    const contents: Array<{
      role: 'user' | 'model';
      parts: Array<{ text: string }>;
    }> = [];

    // Append prior dialogue turns (cap at last 16 turns to maintain focused context)
    const recentHistory = history.slice(-16);
    for (const item of recentHistory) {
      if (item.content && item.content.trim()) {
        contents.push({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.content }]
        });
      }
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await client.models.generateContent({
      model: targetModel,
      contents,
      config: {
        systemInstruction: roleDef.systemInstruction,
        temperature: 0.7,
        topP: 0.95
      }
    });

    const replyText = response.text || 'No response received from safety advisor. Please verify emergency helpline 112.';

    return {
      reply: replyText,
      modelUsed: targetModel,
      roleId: roleDef.id,
      roleName: roleDef.name,
      timestamp: new Date().toISOString()
    };
  } catch (err: any) {
    console.error(`[GeminiChatService] Upstream error calling ${targetModel}:`, err?.message || err);

    // If a complex model (e.g. 3.1-pro-preview) hit rate limits or quota, try fallback to gemini-3.5-flash
    if (targetModel !== 'gemini-3.5-flash') {
      try {
        console.log('[GeminiChatService] Retrying with fallback model gemini-3.5-flash...');
        const fallbackResponse = await client.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: [{ role: 'user', parts: [{ text: message }] }],
          config: {
            systemInstruction: roleDef.systemInstruction
          }
        });
        if (fallbackResponse.text) {
          return {
            reply: fallbackResponse.text,
            modelUsed: 'gemini-3.5-flash (auto-fallback)',
            roleId: roleDef.id,
            roleName: roleDef.name,
            timestamp: new Date().toISOString()
          };
        }
      } catch (fallbackErr) {
        console.error('[GeminiChatService] Secondary fallback failed:', fallbackErr);
      }
    }

    return {
      reply: generateOfflineSafetyReply(message, roleDef, err?.message),
      modelUsed: `${targetModel} (Emergency Fallback)`,
      roleId: roleDef.id,
      roleName: roleDef.name,
      timestamp: new Date().toISOString(),
      isFallback: true
    };
  }
}

function generateOfflineSafetyReply(
  userQuery: string,
  role: AssistantRoleDefinition,
  technicalNote?: string
): string {
  const queryLower = userQuery.toLowerCase();

  let advice = '';
  if (queryLower.includes('cpr') || queryLower.includes('heart') || queryLower.includes('unconscious')) {
    advice =
      `**Immediate CPR Procedure:**\n` +
      `1. Check responsiveness and call **112 / 108** immediately.\n` +
      `2. Place victim on a firm, flat surface.\n` +
      `3. Place heel of one hand in the center of the chest; place your other hand on top and interlock fingers.\n` +
      `4. Push hard and fast: 100–120 compressions per minute at 5 cm depth. Allow chest to fully recoil.\n` +
      `5. Continue uninterrupted until emergency personnel take over.`;
  } else if (queryLower.includes('earthquake')) {
    advice =
      `**Immediate Earthquake Survival:**\n` +
      `1. **DROP** to your hands and knees.\n` +
      `2. **COVER** your head and neck under a sturdy table or desk.\n` +
      `3. **HOLD ON** until the shaking stops completely.\n` +
      `4. Stay away from glass windows, unanchored heavy furniture, and electrical poles.\n` +
      `5. Do NOT use elevators. Exit via stairs once shaking has subsided.`;
  } else if (queryLower.includes('flood') || queryLower.includes('water')) {
    advice =
      `**Immediate Flood Safety Rules:**\n` +
      `1. Never walk, swim, or drive through moving flood waters (Turn Around, Don't Drown).\n` +
      `2. Move to higher ground or upper floors of structurally sound buildings.\n` +
      `3. Disconnect the main electrical power supply and gas cylinders before water enters.\n` +
      `4. Boil all drinking water for at least 3 minutes or use halogen chlorine water purification tablets.`;
  } else {
    advice =
      `**General Civil Defense Guidance:**\n` +
      `For life-threatening emergencies, dial **112 (National Emergency Helpline)**, **108 (Ambulance)**, or **1070 (State Emergency Operations Center)**.\n` +
      `Monitor official NDMA/IMD weather bulletins on the SURAKSHA Alerts tab and seek the nearest verified public shelter if an evacuation advisory is active.`;
  }

  return (
    `**[SURAKSHA Emergency Safety Notice]**\n\n` +
    `${advice}\n\n` +
    `*Assistant Role:* ${role.name}\n` +
    `*National Emergency Contacts:*\n` +
    `- All-in-One Emergency: **112**\n` +
    `- Medical & Ambulance: **108**\n` +
    `- NDMA Helpline: **1078**\n` +
    `- Disaster Management Control Room: **1070**` +
    (technicalNote ? `\n\n*(Note: Cloud AI engine currently operating in emergency local mode).*` : '')
  );
}
