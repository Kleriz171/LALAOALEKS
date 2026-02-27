import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createNotification } from '../services/notifications';

const router = Router();

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const clientId = req.userId!;
    const { coachId, date, timeSlot, goal, price } = req.body;

    if (!coachId || !date || !timeSlot) {
      return res.status(400).json({ error: 'coachId, date, and timeSlot are required' });
    }

    // coachId here is actually the ID of the CoachProfile
    const coachProfile = await prisma.coachProfile.findUnique({ 
      where: { id: coachId },
      include: { user: { select: { name: true } } }
    });
    
    if (!coachProfile) {
      return res.status(404).json({ error: 'Coach not found' });
    }

    const client = await prisma.user.findUnique({
      where: { id: clientId },
      select: { name: true }
    });

    const bookingDate = new Date(date);

    const conflict = await prisma.booking.findFirst({
      where: {
        coachId: coachProfile.userId,
        date: bookingDate,
        timeSlot,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (conflict) {
      return res.status(409).json({ error: 'This time slot is already booked. Please choose another.' });
    }

    const booking = await prisma.booking.create({
      data: {
        clientId,
        coachId: coachProfile.userId,
        date: bookingDate,
        timeSlot,
        goal: goal || null,
        price: price || coachProfile.price,
        status: 'PENDING',
      },
      include: {
        coach: { select: { id: true, name: true } },
      },
    });

    // Notify coach
    await createNotification(
      coachProfile.userId,
      'BOOKING_REQUEST',
      'New Booking Request',
      `${client?.name || 'A client'} requested a session for ${timeSlot} on ${new Date(date).toLocaleDateString()}.`,
      { bookingId: booking.id, clientId }
    );

    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const bookings = await prisma.booking.findMany({
      where: { clientId: userId },
      include: {
        coach: { select: { id: true, name: true } },
      },
      orderBy: { date: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/cancel', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({ 
      where: { id },
      include: { client: { select: { name: true } } }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.clientId !== userId) {
      return res.status(403).json({ error: 'Not your booking' });
    }

    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
      return res.status(400).json({ error: `Cannot cancel a ${booking.status.toLowerCase()} booking` });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // Notify coach
    await createNotification(
      booking.coachId,
      'BOOKING_CANCELLED',
      'Booking Cancelled',
      `${booking.client.name} cancelled their session for ${booking.timeSlot} on ${new Date(booking.date).toLocaleDateString()}.`,
      { bookingId: id, clientId: userId }
    );

    res.json({ message: 'Booking cancelled', booking: updated });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
