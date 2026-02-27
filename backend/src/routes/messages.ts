import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { containsInappropriateContent, getContentError } from '../services/contentFilter';

const router = Router();

router.get('/conversations', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const participantRecords = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true, lastReadAt: true },
    });

    const conversationIds = participantRecords.map(p => p.conversationId);
    const lastReadMap = new Map(participantRecords.map(p => [p.conversationId, p.lastReadAt]));

    const conversations = await prisma.conversation.findMany({
      where: { id: { in: conversationIds } },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const result = await Promise.all(
      conversations.map(async (conv) => {
        const lastRead = lastReadMap.get(conv.id);
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            ...(lastRead ? { createdAt: { gt: lastRead } } : {}),
          },
        });

        return {
          id: conv.id,
          participants: conv.participants.map(p => ({
            id: p.user.id,
            name: p.user.name,
            avatar: p.user.avatar,
          })),
          lastMessage: conv.messages[0]
            ? {
                id: conv.messages[0].id,
                content: conv.messages[0].content,
                senderId: conv.messages[0].senderId,
                createdAt: conv.messages[0].createdAt.toISOString(),
              }
            : null,
          unreadCount,
          updatedAt: conv.updatedAt.toISOString(),
        };
      })
    );

    res.json(result);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/conversations', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ error: 'recipientId is required' });
    }

    if (recipientId === userId) {
      return res.status(400).json({ error: 'Cannot create conversation with yourself' });
    }

    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: recipientId } } },
        ],
      },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
    });

    if (existing) {
      return res.json({ 
        conversation: { 
          id: existing.id, 
          participants: existing.participants.map(p => ({ id: p.user.id, name: p.user.name, avatar: p.user.avatar })) 
        } 
      });
    }

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId },
            { userId: recipientId },
          ],
        },
      },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
    });

    res.status(201).json({
      conversation: {
        id: conversation.id,
        participants: conversation.participants.map(p => ({ id: p.user.id, name: p.user.name, avatar: p.user.avatar })),
      },
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/conversations/:id/messages', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { limit = '50', before } = req.query;

    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: id, userId } },
    });

    if (!participant) {
      return res.status(403).json({ error: 'Not a participant of this conversation' });
    }

    const where: any = { conversationId: id };
    if (before) {
      where.createdAt = { lt: new Date(before as string) };
    }

    const messages = await prisma.message.findMany({
      where,
      include: { sender: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
    });

    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/conversations/:id/messages', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    if (containsInappropriateContent(content)) {
      return res.status(400).json({ error: getContentError('Message') });
    }

    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: id, userId } },
    });

    if (!participant) {
      return res.status(403).json({ error: 'Not a participant of this conversation' });
    }

    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: { conversationId: id, senderId: userId, content: content.trim() },
        include: { sender: { select: { id: true, name: true, avatar: true } } },
      }),
      prisma.conversation.update({
        where: { id },
        data: { updatedAt: new Date() },
      }),
      prisma.conversationParticipant.update({
        where: { conversationId_userId: { conversationId: id, userId } },
        data: { lastReadAt: new Date() },
      }),
    ]);

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/conversations/:id/read', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId: id, userId } },
      data: { lastReadAt: new Date() },
    });

    res.json({ message: 'Marked as read' });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
