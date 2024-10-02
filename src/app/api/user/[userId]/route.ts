import db from '@/lib/db';
import { HandlerApiError, HandlerApiResponse } from '@/utils/handlerResponse';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import options from '../../auth/[...nextauth]/options';

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(options);
  if (!session) return HandlerApiError.unauthorized();
  const userId = params.userId as string;
  if (session.user.id !== userId) {
    return HandlerApiError.unauthorized();
  }

  const body = await req.json();

  const updatedUser = await db.user.update({
    where: {
      id: userId,
    },
    data: body,
  });

  if (!updatedUser) return HandlerApiError.internalServerError();

  return HandlerApiResponse.created(updatedUser);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(options);
  if (!session) return HandlerApiError.unauthorized();
  const userId = params.userId as string;
  if (session.user.id !== userId) {
    return HandlerApiError.unauthorized();
  }

  const account = await db.user.delete({
    where: {
      id: userId,
    },
  });

  await db.team.deleteMany({
    where: {
      memberships: {
        none: {},
      },
    },
  });

  if (!account) return HandlerApiError.internalServerError();

  return HandlerApiResponse.ok(account);
}
