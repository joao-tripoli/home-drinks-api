import { getAuth } from '@clerk/express';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { userId, sessionId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authenticated user found',
      });
    }

    // Return user information from Clerk
    const user = {
      id: userId,
      sessionId: sessionId,
      // Add any additional user data you need
    };

    logger.info('Current user retrieved', { userId });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Error getting current user', { error });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get current user',
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId, sessionId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Here you could fetch additional user profile data from your database
    // For now, we'll just return the Clerk user info

    logger.info('User profile retrieved', { userId: userId });

    res.json({
      success: true,
      data: {
        id: userId,
        sessionId: sessionId,
        // Add any additional profile fields
      },
    });
  } catch (error) {
    logger.error('Error getting user profile', { error });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get user profile',
    });
  }
};
