import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { getAllHealthConditionOptions } from '../constants/healthConditions';

const router = Router();

router.get('/conditions', async (req, res: Response) => {
  try {
    const options = getAllHealthConditionOptions();

    res.json({
      success: true,
      data: options,
      message: 'Health condition options retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching health conditions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch health condition options'
    });
  }
});

router.get('/conditions/physical-limitations', async (req, res: Response) => {
  try {
    const options = getAllHealthConditionOptions();

    res.json({
      success: true,
      data: options.physicalLimitations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch physical limitations'
    });
  }
});

router.get('/conditions/medical', async (req, res: Response) => {
  try {
    const options = getAllHealthConditionOptions();

    res.json({
      success: true,
      data: options.medicalConditions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch medical conditions'
    });
  }
});

router.get('/conditions/allergies', async (req, res: Response) => {
  try {
    const options = getAllHealthConditionOptions();

    res.json({
      success: true,
      data: options.foodAllergies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch food allergies'
    });
  }
});

router.get('/conditions/dietary-preferences', async (req, res: Response) => {
  try {
    const options = getAllHealthConditionOptions();

    res.json({
      success: true,
      data: options.dietaryPreferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dietary preferences'
    });
  }
});

export default router;
