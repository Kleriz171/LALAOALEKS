import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createNotification } from '../services/notifications';
import { containsInappropriateContent, getContentError } from '../services/contentFilter';

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { search, specialty } = req.query;
    const currentUserId = req.userId;

    const where: any = {};

    if (search) {
      where.OR = [
        { user: { name: { contains: search as string, mode: 'insensitive' } } },
        { specialty: { hasSome: [search as string] } },
        { bio: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (specialty && specialty !== 'All') {
      where.specialty = { has: specialty as string };
    }

    const profiles = await prisma.coachProfile.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        posts: { 
          orderBy: { createdAt: 'desc' }, 
          take: 6,
          include: {
            likes: currentUserId ? { where: { userId: currentUserId } } : false,
            comments: {
              include: { user: { select: { id: true, name: true } } },
              orderBy: { createdAt: 'desc' },
              take: 3
            }
          }
        },
        stories: {
          where: { expiresAt: { gt: new Date() } },
          orderBy: { createdAt: 'desc' },
        },
        followers: currentUserId ? { where: { userId: currentUserId } } : false,
      },
      orderBy: { rating: 'desc' },
    });

    const coaches = profiles.map(p => ({
      id: p.id,
      userId: p.userId,
      name: p.user.name,
      avatar: p.avatar,
      specialty: p.specialty,
      rating: p.rating,
      reviewCount: p.reviewCount,
      price: `$${p.price}/session`,
      bio: p.bio,
      experience: p.experience,
      certifications: p.certifications,
      clientCount: p.clientCount,
      followerCount: p.followerCount,
      isFollowing: p.followers && p.followers.length > 0,
      verified: p.verified,
      availability: p.availability,
      stories: p.stories.map(s => ({
        id: s.id,
        type: s.type,
        title: s.title,
        description: s.description,
        timestamp: s.createdAt.toISOString(),
      })),
      posts: p.posts.map(post => ({
        id: post.id,
        type: post.type,
        caption: post.caption,
        imageUrl: post.imageUrl,
        likes: post.likesCount,
        comments: post.commentsCount,
        shares: post.sharesCount,
        isLiked: post.likes && post.likes.length > 0,
        recentComments: post.comments.map(c => ({
          id: c.id,
          userId: c.userId,
          userName: c.user.name,
          content: c.content,
          timestamp: c.createdAt.toISOString()
        })),
        timestamp: post.createdAt.toISOString(),
      })),
    }));

    res.json(coaches);
  } catch (error) {
    console.error('Error fetching coaches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.userId;

    const profile = await prisma.coachProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
            likes: currentUserId ? { where: { userId: currentUserId } } : false,
            comments: {
              include: { user: { select: { id: true, name: true } } },
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        stories: {
          where: { expiresAt: { gt: new Date() } },
          orderBy: { createdAt: 'desc' },
        },
        followers: currentUserId ? { where: { userId: currentUserId } } : false,
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Coach not found' });
    }

    const coach = {
      id: profile.id,
      userId: profile.userId,
      name: profile.user.name,
      avatar: profile.avatar,
      specialty: profile.specialty,
      rating: profile.rating,
      reviewCount: profile.reviewCount,
      price: `$${profile.price}/session`,
      bio: profile.bio,
      experience: profile.experience,
      certifications: profile.certifications,
      clientCount: profile.clientCount,
      followerCount: profile.followerCount,
      isFollowing: profile.followers && profile.followers.length > 0,
      verified: profile.verified,
      availability: profile.availability,
      stories: profile.stories.map(s => ({
        id: s.id,
        type: s.type,
        title: s.title,
        description: s.description,
        timestamp: s.createdAt.toISOString(),
      })),
      posts: profile.posts.map(post => ({
        id: post.id,
        type: post.type,
        caption: post.caption,
        imageUrl: post.imageUrl,
        likes: post.likesCount,
        comments: post.commentsCount,
        shares: post.sharesCount,
        isLiked: post.likes && post.likes.length > 0,
        recentComments: post.comments.map(c => ({
          id: c.id,
          userId: c.userId,
          userName: c.user.name,
          content: c.content,
          timestamp: c.createdAt.toISOString()
        })),
        timestamp: post.createdAt.toISOString(),
      })),
      reviews: profile.reviews.map(r => ({
        id: r.id,
        userId: r.userId,
        userName: r.user.name,
        userAvatar: (r.user as any).avatar ?? null,
        rating: r.rating,
        comment: r.comment,
        timestamp: r.createdAt.toISOString(),
        isOwn: r.userId === currentUserId,
      })),
      myReview: profile.reviews.find(r => r.userId === currentUserId) ?? null,
    };

    res.json(coach);
  } catch (error) {
    console.error('Error fetching coach:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/follow', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const coachProfile = await prisma.coachProfile.findUnique({ 
      where: { id },
      include: { user: { select: { name: true } } }
    });
    if (!coachProfile) return res.status(404).json({ error: 'Coach not found' });

    if (coachProfile.userId === userId) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });

    await prisma.$transaction([
      prisma.follow.upsert({
        where: { userId_coachProfileId: { userId, coachProfileId: id } },
        create: { userId, coachProfileId: id },
        update: {},
      }),
      prisma.coachProfile.update({
        where: { id },
        data: { followerCount: { increment: 1 } },
      }),
    ]);

    // Create notification for coach
    await createNotification(
      coachProfile.userId,
      'FOLLOW',
      'New Follower',
      `${currentUser?.name || 'Someone'} started following you!`,
      { followerId: userId }
    );

    res.json({ message: 'Followed successfully' });
  } catch (error) {
    console.error('Error following coach:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/unfollow', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const follow = await prisma.follow.findUnique({
      where: { userId_coachProfileId: { userId, coachProfileId: id } },
    });

    if (!follow) return res.status(400).json({ error: 'You are not following this coach' });

    await prisma.$transaction([
      prisma.follow.delete({
        where: { userId_coachProfileId: { userId, coachProfileId: id } },
      }),
      prisma.coachProfile.update({
        where: { id },
        data: { followerCount: { decrement: 1 } },
      }),
    ]);

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing coach:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Post Interactions
router.post('/posts/:postId/like', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.userId!;

    const like = await prisma.coachPostLike.findUnique({
      where: { postId_userId: { postId, userId } }
    });

    if (like) {
      await prisma.$transaction([
        prisma.coachPostLike.delete({ where: { id: like.id } }),
        prisma.coachPost.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } }
        })
      ]);
      return res.json({ message: 'Unliked', liked: false });
    }

    await prisma.$transaction([
      prisma.coachPostLike.create({ data: { postId, userId } }),
      prisma.coachPost.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } }
      })
    ]);

    // Optional: Notify post owner
    const post = await prisma.coachPost.findUnique({ 
      where: { id: postId },
      include: { coachProfile: true }
    });
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    
    if (post && post.coachProfile.userId !== userId) {
      await createNotification(
        post.coachProfile.userId,
        'SYSTEM',
        'New Like',
        `${user?.name || 'Someone'} liked your post.`,
        { postId }
      );
    }

    res.json({ message: 'Liked', liked: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
});

router.post('/posts/:postId/comment', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.userId!;

    if (!content) return res.status(400).json({ error: 'Comment content is required' });

    if (containsInappropriateContent(content)) {
      return res.status(400).json({ error: getContentError('Comment') });
    }

    const [comment] = await prisma.$transaction([
      prisma.coachPostComment.create({
        data: { postId, userId, content },
        include: { user: { select: { id: true, name: true } } }
      }),
      prisma.coachPost.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } }
      })
    ]);

    // Notify post owner
    const post = await prisma.coachPost.findUnique({ 
      where: { id: postId },
      include: { coachProfile: true }
    });
    
    if (post && post.coachProfile.userId !== userId) {
      await createNotification(
        post.coachProfile.userId,
        'SYSTEM',
        'New Comment',
        `${comment.user.name} commented: "${content.substring(0, 30)}..."`,
        { postId, commentId: comment.id }
      );
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to comment' });
  }
});

router.post('/:id/reviews', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const profile = await prisma.coachProfile.findUnique({ where: { id } });
    if (!profile) return res.status(404).json({ error: 'Coach not found' });
    if (profile.userId === userId) return res.status(400).json({ error: 'You cannot review yourself' });

    const existing = await prisma.coachReview.findUnique({
      where: { coachProfileId_userId: { coachProfileId: id, userId } },
    });

    let review;
    if (existing) {
      review = await prisma.coachReview.update({
        where: { id: existing.id },
        data: { rating, comment: comment || null },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      });
    } else {
      review = await prisma.coachReview.create({
        data: { coachProfileId: id, userId, rating, comment: comment || null },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      });
    }

    const allReviews = await prisma.coachReview.findMany({ where: { coachProfileId: id } });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.coachProfile.update({
      where: { id },
      data: { rating: Math.round(avg * 10) / 10, reviewCount: allReviews.length },
    });

    res.json({
      id: review.id,
      userId: review.userId,
      userName: review.user.name,
      userAvatar: (review.user as any).avatar ?? null,
      rating: review.rating,
      comment: review.comment,
      timestamp: review.createdAt.toISOString(),
      isOwn: true,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

router.delete('/:id/reviews', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const review = await prisma.coachReview.findUnique({
      where: { coachProfileId_userId: { coachProfileId: id, userId } },
    });
    if (!review) return res.status(404).json({ error: 'Review not found' });

    await prisma.coachReview.delete({ where: { id: review.id } });

    const allReviews = await prisma.coachReview.findMany({ where: { coachProfileId: id } });
    const avg = allReviews.length > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length : 0;
    await prisma.coachProfile.update({
      where: { id },
      data: { rating: Math.round(avg * 10) / 10, reviewCount: allReviews.length },
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

router.post('/posts/:postId/share', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    await prisma.coachPost.update({
      where: { id: postId },
      data: { sharesCount: { increment: 1 } }
    });
    res.json({ message: 'Shared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to share post' });
  }
});

export default router;
