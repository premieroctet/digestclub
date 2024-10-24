import NewsletterEmail from '@/emails/templates/NewsletterEmail';
import db from '@/lib/db';
import { checkDigest, checkTeam } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { getEnvHost } from '@/lib/server';
import { Digest, DigestBlockType } from '@prisma/client';
import * as SibApiV3Sdk from '@sendinblue/client';
import { render } from 'mjml-react';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

apiInstance.basePath = 'https://api.sendinblue.com/v3';

export type ApiDigestResponseSuccess = Digest;

export const router = createRouter<AuthApiRequest, NextApiResponse>();

function getFallbackImage(id: string) {
  return `https://digest.club/api/bookmark-og?bookmark=${id}`;
}

function isResponseImage(response: Response) {
  const contentType = response.headers.get('content-type');
  return contentType?.startsWith('image');
}

async function getSubject({
  title,
  teamId,
}: {
  title: string | undefined;
  teamId: string;
}) {
  if (title) {
    return title;
  }
  const team = await db.team.findUnique({
    where: {
      id: teamId,
    },
    select: {
      name: true,
    },
  });
  if (!team) {
    throw new Error('Team not found');
  }
  return `${team.name} Digest`;
}

router
  .use(checkTeam)
  .use(checkDigest)
  .post(async (req, res) => {
    try {
      const hostUrl = getEnvHost() || 'https://digest-club.com';
      const digestId = req.query.digestId as string;
      const teamId = req.teamId!;
      const digest = await db.digest.findUnique({
        where: {
          id: digestId,
        },
        include: {
          digestBlocks: {
            orderBy: {
              order: 'asc',
            },
            include: {
              bookmark: {
                include: {
                  link: true,
                },
              },
            },
          },
        },
      });

      const team = await db.team.findUnique({
        where: {
          id: teamId,
        },
        select: {
          name: true,
          slug: true,
          id: true,
          color: true,
        },
      });
      if (!team) {
        return res.status(400).json({
          error: 'Team not found',
        });
      }

      const subscriberCount = await db.subscription.count({
        where: {
          teamId,
        },
      });

      if (subscriberCount === 0) {
        return res.status(400).json({
          error: 'No subscribers',
        });
      }

      if (digest?.hasSentNewsletter) {
        return res.status(400).json({
          error: 'Newsletter already sent',
        });
      }

      const subscribers = await db.subscription.findMany({
        where: {
          teamId,
        },
        select: {
          email: true,
        },
      });

      const subject = await getSubject({
        title: digest?.title,
        teamId,
      });

      // Check all image links concurrently and wait for results
      const deadLinks: string[] = [];
      if (digest?.digestBlocks) {
        const imageChecks = digest.digestBlocks
          .filter(
            (block) =>
              block.type === DigestBlockType.BOOKMARK &&
              block.bookmark &&
              block.bookmark.link.image
          )
          .map(async (block) => {
            try {
              const response = await fetch(block.bookmark!.link.image!);
              if (!response.ok || !isResponseImage(response)) {
                deadLinks.push(block.bookmark!.id);
              }
            } catch (error) {
              // If fetch fails, consider it a dead link
              deadLinks.push(block.bookmark!.id);
            }
          });

        // Wait for all image checks to complete
        await Promise.all(imageChecks);
      }

      const { html } = render(
        <NewsletterEmail
          title={subject}
          description={digest?.description}
          blocks={digest?.digestBlocks.map((block) => {
            const fallbackImage = getFallbackImage(block.bookmark?.id!);
            if (block.type === DigestBlockType.BOOKMARK && block.bookmark) {
              return {
                type: DigestBlockType.BOOKMARK,
                title: block.title || block.bookmark!.link.title,
                url: block.bookmark!.link.url,
                description:
                  block.description || block.bookmark!.link.description,
                image: deadLinks.includes(block.bookmark.id)
                  ? fallbackImage
                  : block.bookmark!.link.image ?? fallbackImage,
                style: block.style,
              };
            } else if (block.type === DigestBlockType.TEXT && block.text) {
              return {
                type: DigestBlockType.TEXT,
                text: block.text,
                style: block.style,
              };
            } else {
              throw new Error(
                'Invalid block type, or missing valid block data'
              );
            }
          })}
          team={team}
          digestSlug={digest?.slug!}
          hostUrl={hostUrl}
        />
      );

      const data = await apiInstance.sendTransacEmail({
        subject,
        htmlContent: html,
        sender: { name: team.name, email: 'noreply@digestclub.com' },
        messageVersions: subscribers.map((subscriber) => {
          return {
            to: [{ email: subscriber.email, name: 'Subscriber' }],
            params: {
              email: subscriber.email,
            },
            header: {
              'List-Unsubscribe': `${hostUrl}/unsubscribe?email=${subscriber.email}&teamId=${teamId}`,
            },
            htmlContent: html,
          };
        }),
      });

      await db.digest.update({
        where: {
          id: digestId,
        },
        data: {
          hasSentNewsletter: true,
        },
      });

      return res.status(201).end();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log({
        error: e,
      });
      return res.status(500).end();
    }
  });

export default router.handler({
  onError: errorHandler,
});
