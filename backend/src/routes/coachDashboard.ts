import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireCoach } from '../middleware/coach';
import { createNotification } from '../services/notifications';
import { containsInappropriateContent, getContentError } from '../services/contentFilter';
import { isImageSafe } from '../services/imageModeration';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = 'uploads/posts';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});
const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const avatarStorage = multer.diskStorage({
  destination: 'uploads/avatars',
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const router = Router();

router.get('/profile', authenticateToken, requireCoach, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.coachProfile.findUnique({
      where: { userId: req.userId! },
      include: {
        user: { select: { id: true, name: true, email: true } },
        posts: { orderBy: { createdAt: 'desc' } },
        stories: {
          where: { expiresAt: { gt: new Date() } },
          orderBy: { createdAt: 'desc' },
        },
        followers: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } }, orderBy: { createdAt: 'desc' } },
        reviews: { orderBy: { createdAt: 'desc' }, include: { user: { select: { id: true, name: true } } } },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Coach profile not found' });
    }

    const followerCount = profile.followers.length;
    const reviewCount = profile.reviews.length;
    const avgRating = reviewCount > 0
      ? Math.round(profile.reviews.reduce((s, r) => s + r.rating, 0) / reviewCount * 10) / 10
      : 0;

    res.json({
      ...profile,
      name: profile.user.name,
      email: profile.user.email,
      followerCount,
      reviewCount,
      rating: avgRating,
      followers: profile.followers.map(f => ({
        id: f.user.id,
        name: f.user.name,
        email: f.user.email,
        avatar: (f.user as any).avatar ?? null,
        followedAt: f.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching coach profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/profile', authenticateToken, requireCoach, async (req: AuthRequest, res: Response) => {
  try {
    const { bio, price, availability, avatar, specialty } = req.body;

    if (bio !== undefined && containsInappropriateContent(bio)) {
      return res.status(400).json({ error: getContentError('Bio') });
    }

    const data: any = {};
    if (bio !== undefined) data.bio = bio;
    if (price !== undefined) data.price = parseFloat(price);
    if (availability !== undefined) data.availability = availability;
    if (avatar !== undefined) data.avatar = avatar;
    if (specialty !== undefined) data.specialty = specialty;

    const [profile] = await prisma.$transaction([
      prisma.coachProfile.update({
        where: { userId: req.userId! },
        data,
      }),
      ...(avatar !== undefined ? [
        prisma.user.update({
          where: { id: req.userId! },
          data: { avatar },
        })
      ] : [])
    ]);

    res.json({ message: 'Profile updated', profile });
  } catch (error) {
    console.error('Error updating coach profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/avatar', authenticateToken, requireCoach, uploadAvatar.single('avatar') as any, async (req: AuthRequest, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file) return res.status(400).json({ error: 'No image uploaded' });

    const { safe, reason } = await isImageSafe(file.path);
    if (!safe) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: reason });
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;

    const [profile] = await prisma.$transaction([
      prisma.coachProfile.update({
        where: { userId: req.userId! },
        data: { avatar: avatarUrl },
      }),
      prisma.user.update({
        where: { id: req.userId! },
        data: { avatar: avatarUrl },
      })
    ]);

    res.json({ avatarUrl, profile });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/upload-image', authenticateToken, requireCoach, uploadImage.single('image') as any, async (req: AuthRequest, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file) return res.status(400).json({ error: 'No image uploaded' });

    const { safe, reason } = await isImageSafe(file.path);
    if (!safe) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: reason });
    }

    res.json({ imageUrl: `/uploads/posts/${file.filename}` });
  } catch (error) {
    console.error('Error uploading post image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/posts', authenticateToken, requireCoach, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.coachProfile.findUnique({ where: { userId: req.userId! } });
    if (!profile) return res.status(404).json({ error: 'Coach profile not found' });

    const { caption, imageUrl, type } = req.body;

    if (!caption) {
      return res.status(400).json({ error: 'Caption is required' });
    }

    if (containsInappropriateContent(caption)) {
      return res.status(400).json({ error: getContentError('Caption') });
    }

    const post = await prisma.coachPost.create({
      data: {
        coachProfileId: profile.id,
        caption,
        imageUrl: imageUrl || null,
        type: type || 'photo',
      },
    });

    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/posts/:id', authenticateToken, requireCoach, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.coachProfile.findUnique({ where: { userId: req.userId! } });
    if (!profile) return res.status(404).json({ error: 'Coach profile not found' });

    const post = await prisma.coachPost.findUnique({ where: { id: req.params.id } });

    if (!post || post.coachProfileId !== profile.id) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await prisma.coachPost.delete({ where: { id: req.params.id } });

    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/stories', authenticateToken, requireCoach, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.coachProfile.findUnique({ where: { userId: req.userId! } });
    if (!profile) return res.status(404).json({ error: 'Coach profile not found' });

    const { type, title, description } = req.body;

    if (!type || !title || !description) {
      return res.status(400).json({ error: 'type, title, and description are required' });
    }

    if (containsInappropriateContent(title)) {
      return res.status(400).json({ error: getContentError('Title') });
    }

    if (containsInappropriateContent(description)) {
      return res.status(400).json({ error: getContentError('Description') });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await prisma.coachStory.create({
      data: {
        coachProfileId: profile.id,
        type,
        title,
        description,
        expiresAt,
      },
    });

    res.status(201).json({ message: 'Story created', story });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/bookings', authenticateToken, requireCoach, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { coachId: req.userId! },
      include: {
        client: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching coach bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/bookings/:id', authenticateToken, requireCoach, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await prisma.booking.findUnique({ 
      where: { id },
      include: { coach: { select: { name: true } } }
    });

    if (!booking || booking.coachId !== req.userId!) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { client: { select: { id: true, name: true } } },
    });

    // Notify client
    let notifTitle = '';
    let notifContent = '';
    let notifType: any = '';

    if (status === 'CONFIRMED') {
      notifType = 'BOOKING_CONFIRMED';
      notifTitle = 'Booking Confirmed!';
      notifContent = `Your session with Coach ${booking.coach.name} for ${booking.timeSlot} on ${new Date(booking.date).toLocaleDateString()} has been confirmed.`;
    } else if (status === 'CANCELLED') {
      notifType = 'BOOKING_CANCELLED';
      notifTitle = 'Booking Declined';
      notifContent = `Coach ${booking.coach.name} was unable to accept your session for ${booking.timeSlot} on ${new Date(booking.date).toLocaleDateString()}.`;
    }

    if (notifType) {
      await createNotification(
        booking.clientId,
        notifType,
        notifTitle,
        notifContent,
        { bookingId: id, coachId: req.userId! }
      );
    }

    res.json({ message: 'Booking updated', booking: updated });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/followers', authenticateToken, requireCoach, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.coachProfile.findUnique({ where: { userId: req.userId! } });
    if (!profile) return res.status(404).json({ error: 'Coach profile not found' });

    const followers = await prisma.follow.findMany({
      where: { coachProfileId: profile.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const followerUsers = followers.map(f => ({
      id: f.user.id,
      name: f.user.name,
      email: f.user.email,
      followedAt: f.createdAt,
    }));

    res.json(followerUsers);
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
