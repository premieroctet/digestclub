import db from '@/lib/db';
import { checkTeamAppRouter } from '@/lib/middleware';
import {
  createDigest,
  createDigestWithTemplate,
} from '@/services/database/digest-block';
import { HandlerApiError, HandlerApiResponse } from '@/utils/handlerResponse';
import { Digest } from '@prisma/client';
import { createEdgeRouter } from 'next-connect';
import { NextRequest } from 'next/server';

export type ResponseSuccess = Digest;
interface PostBody {
  title: string;
  isTemplate: boolean;
  templateId?: string;
}

export interface TeamsRequestContext {
  params: {
    teamId: string;
  };

  // Not the best way to do this but it works for now
  // We need the middleware to set these values
  // Right now next-connect doesn't support generics to enrich the request (https://github.com/hoangvvo/next-connect/issues/230)
  membershipId: string;
  teamId: string;
  user: { id: string; email: string };
}

const router = createEdgeRouter<NextRequest, TeamsRequestContext>();

router.use(checkTeamAppRouter).post(async (req, event, next) => {
  try {
    const body = (await req.json()) as PostBody;
    const { title, templateId } = body;
    const teamId = event.params.teamId as string;
    if (!title) {
      return HandlerApiError.badRequest();
    }

    const nameAlreadyUsed = await db.digest.findFirst({
      where: {
        title,
        teamId,
      },
    });

    if (nameAlreadyUsed) {
      return HandlerApiError.customError(
        'This digest name already exists',
        400
      );
    }

    if (templateId) {
      const newDigest = await createDigestWithTemplate({
        title,
        templateId,
        teamId,
      });

      return HandlerApiResponse.created(newDigest);
    } else {
      const newDigest = await createDigest({ title, teamId });
      return HandlerApiResponse.created(newDigest);
    }
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.log(error);
    return HandlerApiError.internalServerError();
  }
});
