'use server';
import { FIELDS } from '@/components/teams/form/settings/form-data';
import db from '@/lib/db';
import * as Sentry from '@sentry/nextjs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { imageSize } from 'image-size';
import { basename, extname, join } from 'path';
import { checkAuthAction, checkTeamAction, getErrorMessage } from './utils';
interface UpdateTeamInfoResult {
  error?: {
    message: string;
  };
  data?: {
    team: string;
  };
}

async function updateAvatarFile(
  dirPath: string,
  fileName: string,
  buffer: Buffer,
  oldUrl?: string
) {
  const path = join(dirPath, fileName);

  if (oldUrl) {
    const oldFilname = basename(oldUrl);
    const oldPath = join(dirPath, oldFilname);

    await unlink(oldPath);
  }

  await writeFile(path, buffer);
}

/**
 * Upload an avatar file and link it to a team. If an old avatar exists, delete it.
 * @param file The file to upload and link to the team
 * @param teamId The team ID to link the file to
 * @param oldAvatar The old avatar (path) to delete if it exists
 * @returns
 */
async function updateAvatar(file: File, teamId: string, oldAvatar?: string) {
  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const MIN_WIDTH = 100; // minimum width and height in pixels

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return new Error(`File size must be less than ${MAX_FILE_SIZE_MB}MB.`);
  }

  const fileExtension = extname(file.name);
  const randomString = new Date().getTime().toString();
  const fileName = `${randomString}${fileExtension}`;
  const dirPath = join(process.cwd(), 'uploads', teamId, 'avatar');
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const dimensions = imageSize(buffer);

  if (!dimensions.width || !dimensions.height) {
    throw new Error('Unable to determine image dimensions.');
  }

  if (dimensions.width < MIN_WIDTH || dimensions.height < MIN_WIDTH) {
    throw new Error(`Image must be at least ${MIN_WIDTH}x${MIN_WIDTH} pixels.`);
  }

  if (dimensions.width !== dimensions.height) {
    throw new Error('Image must be square.');
  }

  await mkdir(dirPath, { recursive: true });

  await updateAvatarFile(dirPath, fileName, buffer, oldAvatar);

  await db.team.update({
    where: { id: teamId },
    data: {
      avatar: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/uploads/${teamId}/avatar/${fileName}`, // url to the avatar
    },
  });
}

export default async function updateTeamInfo(
  updatedTeamInfo: FormData,
  teamId: string
): Promise<UpdateTeamInfoResult> {
  try {
    await checkAuthAction();
    await checkTeamAction(teamId);

    const team = await db.team.findUnique({
      where: { id: teamId },
      select: { avatar: true },
    });

    const avatarFile = updatedTeamInfo.get(FIELDS.avatarUpload) as File;
    const name = updatedTeamInfo.get(FIELDS.avatar) as string | null;
    const bio = updatedTeamInfo.get(FIELDS.bio) as string | null;
    const website = updatedTeamInfo.get(FIELDS.website) as string | null;
    const github = updatedTeamInfo.get(FIELDS.github) as string | null;
    const twitter = updatedTeamInfo.get(FIELDS.twitter) as string | null;
    const color = updatedTeamInfo.get(FIELDS.color) as string | null;
    const prompt = updatedTeamInfo.get(FIELDS.prompt) as string | null;

    const updatedFields: any = {};

    if (name) {
      updatedFields['name'] = name;
    }
    if (bio) {
      updatedFields['bio'] = bio;
    }
    if (website) {
      updatedFields['website'] = website;
    }
    if (github) {
      updatedFields['github'] = github;
    }
    if (twitter) {
      updatedFields['twitter'] = twitter;
    }
    if (color) {
      updatedFields['color'] = color;
    }
    if (prompt) {
      updatedFields['prompt'] = prompt;
    }

    const updatedTeam = await db.team.update({
      where: { id: teamId },
      data: {
        ...updatedFields,
      },
    });

    if (avatarFile) {
      await updateAvatar(avatarFile, teamId, team?.avatar ?? undefined);
    }

    return {
      data: {
        team: JSON.stringify(updatedTeam),
      },
    };
  } catch (err: any) {
    Sentry.captureException(err);
    return {
      error: {
        message: getErrorMessage(err.message),
      },
    };
  }
}
