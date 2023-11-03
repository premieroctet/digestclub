'use server';
import db from '@/lib/db';
import * as Sentry from '@sentry/nextjs';
import jwt from 'jsonwebtoken';

interface APIKeyGenerationResult {
  error?: {
    message: string;
  };
  data?: {
    key: string;
  };
}

/**
 * @description Generates an write to the database a new API key for the team
 * @param teamId a string representing the team id
 * @returns
 */
export default async function generateAPIKey(
  teamId: string
): Promise<APIKeyGenerationResult> {
  if (!process.env.JWT_SECRET) {
    return {
      error: {
        message: 'Internal server error',
      },
    };
  }
  try {
    const token = jwt.sign({ teamId }, process.env.JWT_SECRET);

    await db.team.update({
      where: { id: teamId },
      data: {
        apiKey: token,
      },
    });

    return {
      data: {
        key: token,
      },
    };
  } catch (err) {
    Sentry.captureException(err);
    return {
      error: {
        message: 'Internal server error',
      },
    };
  }
}
