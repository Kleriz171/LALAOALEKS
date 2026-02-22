import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const storage = multer.diskStorage({
  destination: 'uploads/certifications',
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const ALLOWED_PDF_MIMES = [
  'application/pdf',
  'application/octet-stream',
  'application/x-pdf',
  'binary/octet-stream',
];

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_PDF_MIMES.includes(file.mimetype) || ext === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

const router = Router();

router.post('/', authenticateToken, (req: AuthRequest, res: Response, next: any) => {
  upload.single('certification')(req as any, res as any, (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    next();
  });
}, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { specialty, experience, bio } = req.body;

    if (!specialty || !experience || !bio) {
      return res.status(400).json({ error: 'Specialty, experience, and bio are required' });
    }

    const existing = await prisma.coachApplication.findUnique({ where: { userId } });
    if (existing) {
      return res.status(409).json({ error: 'You already have a pending application', application: existing });
    }

    const specialtyArray = typeof specialty === 'string' ? specialty.split(',').map((s: string) => s.trim()) : specialty;

    const application = await prisma.coachApplication.create({
      data: {
        userId,
        specialty: specialtyArray,
        experience: parseInt(experience),
        bio,
        certificationPdfPath: (req as any).file?.path || null,
        status: 'PENDING',
      },
    });

    res.status(201).json({ message: 'Application submitted', application });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const application = await prisma.coachApplication.findUnique({ where: { userId } });

    if (!application) {
      return res.status(404).json({ error: 'No application found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
