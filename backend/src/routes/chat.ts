import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { sendChatMessage, CharacterType } from '../services/chatService';
import prisma from '../lib/prisma';

const router = Router();

router.post('/send', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { message, character = 'hype_coach', history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const validCharacters: CharacterType[] = ['drill_sergeant', 'zen_coach', 'hype_coach'];
    const selectedCharacter = validCharacters.includes(character) ? character : 'hype_coach';

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        age: true,
        gender: true,
        weight: true,
        height: true,
        activityLevel: true,
        fitnessGoal: true,
        healthConditions: true,
        physicalLimitations: true,
        foodAllergies: true,
        dietaryPreferences: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const response = await sendChatMessage(
      message.trim(),
      selectedCharacter,
      history.slice(-20),
      {
        name: user.name,
        age: user.age ?? undefined,
        gender: user.gender ?? undefined,
        weight: user.weight ?? undefined,
        height: user.height ?? undefined,
        activityLevel: user.activityLevel ?? undefined,
        fitnessGoal: user.fitnessGoal ?? undefined,
        healthConditions: user.healthConditions,
        physicalLimitations: user.physicalLimitations,
        foodAllergies: user.foodAllergies,
        dietaryPreferences: user.dietaryPreferences,
      }
    );

    res.json({ success: true, response });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

export default router;
