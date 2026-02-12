const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export type CharacterType = 'drill_sergeant' | 'zen_coach' | 'hype_coach';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface UserProfile {
  name: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  activityLevel?: string;
  fitnessGoal?: string;
  healthConditions?: string[];
  physicalLimitations?: string[];
  foodAllergies?: string[];
  dietaryPreferences?: string[];
}

const CHARACTER_PROMPTS: Record<CharacterType, string> = {
  drill_sergeant: `You are DRILL SERGEANT mode. Be tough, direct, no-nonsense. Use military-style motivation. No excuses accepted. Push the user to their limits. Short, punchy sentences. Example tone: "Drop and give me 20! You think results come from sitting around? Get moving, soldier!"`,
  zen_coach: `You are ZEN COACH mode. Be calm, mindful, and balanced. Focus on the mind-body connection. Encourage steady progress over perfection. Use peaceful, thoughtful language. Example tone: "Remember, every journey begins with a single step. Listen to your body, honor your progress."`,
  hype_coach: `You are HYPE COACH mode. Be SUPER energetic and enthusiastic! Celebrate every win, no matter how small. Use exclamation marks, caps for emphasis, and ultra-motivational language. Example tone: "LET'S GOOO! You're absolutely CRUSHING it! Every rep, every meal, every step - you're becoming a CHAMPION!"`,
};

function buildSystemPrompt(character: CharacterType, userProfile: UserProfile): string {
  const charPrompt = CHARACTER_PROMPTS[character] || CHARACTER_PROMPTS.hype_coach;

  let profileContext = '';
  if (userProfile.age) profileContext += `Age: ${userProfile.age}\n`;
  if (userProfile.gender) profileContext += `Gender: ${userProfile.gender}\n`;
  if (userProfile.weight) profileContext += `Weight: ${userProfile.weight}kg\n`;
  if (userProfile.height) profileContext += `Height: ${userProfile.height}cm\n`;
  if (userProfile.activityLevel) profileContext += `Activity Level: ${userProfile.activityLevel}\n`;
  if (userProfile.fitnessGoal) profileContext += `Fitness Goal: ${userProfile.fitnessGoal}\n`;
  if (userProfile.healthConditions?.length) profileContext += `Health Conditions: ${userProfile.healthConditions.join(', ')}\n`;
  if (userProfile.physicalLimitations?.length) profileContext += `Physical Limitations: ${userProfile.physicalLimitations.join(', ')}\n`;
  if (userProfile.foodAllergies?.length) profileContext += `Food Allergies: ${userProfile.foodAllergies.join(', ')}\n`;
  if (userProfile.dietaryPreferences?.length) profileContext += `Dietary Preferences: ${userProfile.dietaryPreferences.join(', ')}\n`;

  return `You are the AnatomLabs fitness assistant inside a mobile fitness app.

STRICT RULES:
- ONLY answer questions about fitness, exercise, nutrition, health, wellness, and app-related topics.
- If someone asks about ANYTHING else (politics, coding, math, history, entertainment, etc.), politely refuse and redirect them to fitness/health topics.
- Keep responses concise and mobile-friendly (under 200 words unless the question requires detail).
- When giving advice, consider the user's profile below.
- Never provide medical diagnoses. Recommend consulting a doctor for medical concerns.
- Be aware of the user's health conditions and allergies when giving nutrition/exercise advice.

${charPrompt}

USER PROFILE:
Name: ${userProfile.name}
${profileContext}`;
}

export async function sendChatMessage(
  message: string,
  character: CharacterType,
  history: ChatMessage[],
  userProfile: UserProfile
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "I'm currently unavailable. Please try again later.";
  }

  try {
    const systemPrompt = buildSystemPrompt(character, userProfile);

    const contents = [];

    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt + '\n\nRespond with "Understood" to confirm.' }],
    });
    contents.push({
      role: 'model',
      parts: [{ text: 'Understood.' }],
    });

    for (const msg of history) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error('Gemini chat API error:', response.status, JSON.stringify(errorBody));
      if (response.status === 429) {
        return "I've reached my usage limit for the moment. Please try again in about 30 seconds.";
      }
      return "Sorry, I'm having trouble right now. Please try again in a moment.";
    }

    const data: any = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return "I couldn't generate a response. Please try again.";
    }

    return text.trim();
  } catch (error) {
    console.error('Chat service error:', error);
    return "Something went wrong. Please try again.";
  }
}
