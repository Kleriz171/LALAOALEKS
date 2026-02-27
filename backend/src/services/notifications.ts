import prisma from '../lib/prisma';

export type NotificationType = 'FOLLOW' | 'BOOKING_REQUEST' | 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'SYSTEM';

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  content: string,
  data?: any
) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        content,
        data: data || {},
      },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
