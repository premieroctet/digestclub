import { DigestDataForTypefullyResult } from '@/lib/queries';
import { getEnvHost } from '@/lib/server';
import { DigestBlockType } from '@prisma/client';

/**
 *
 * @param content an array of strings that will be joined by newlines, each string will represent a part of the thread
 * @returns a string that match the format of a thread (cf: https://help.typefully.com/api#c8332ebfabff4e1999b14c97959c4d54)
 * @example
 * createThreadContent(['First part of the thread', 'Second part of the thread'])
 *
 */
function createThreadContent(content: string[]): string {
  const divider = '\n\n\n\n\n';
  return content.join(divider);
}

/**
 * Trim the description to fit in a tweet
 * @param description the description of the digest
 * @param tweetLength the length of the tweet (title + url + description)
 * @returns the description (or a trimmed version of it if it's too long)
 */
function trimDescription(description: string, tweetLength: number): string {
  const maxTweetLength = 280;
  if (tweetLength < maxTweetLength) return description;
  const diff = tweetLength - maxTweetLength;
  const trimmedDescription = description.slice(0, -diff - 3);
  return `${trimmedDescription}...`;
}

function formatBookmarkDigestToContent(
  blockBookmark: NonNullable<DigestDataForTypefullyResult>['digestBlocks'][0]
): string {
  if (!blockBookmark.bookmark)
    throw new Error('BookmarkDigest should have a bookmark');
  const title = blockBookmark.title || blockBookmark.bookmark.link.title;
  const description =
    blockBookmark.description || blockBookmark.bookmark.link.description;
  const url = blockBookmark.bookmark.link.url;
  if (!title) return url;
  if (!description) return `${title}\n\n${url}`;

  const tweetLength = title.length + url.length + description.length;
  const trimmedDescription = trimDescription(description, tweetLength);
  return `${title}\n\n${trimmedDescription}\n\n${url}`;
}

export const createTypefullyDraft = async (
  digest: NonNullable<DigestDataForTypefullyResult>,
  apiKey: string
) => {
  const { title, description } = digest;
  const digestPublicUrl = `${getEnvHost()}/${digest.team.slug}/${digest.slug}`;
  const threadHead = Boolean(description)
    ? `${title}\n\n${description}\n\n${digestPublicUrl}`
    : `${title}\n\n${digestPublicUrl}`;
  const blocks = digest.digestBlocks;
  const threadBody = blocks
    .filter((block) => block.type === DigestBlockType.BOOKMARK)
    .map(formatBookmarkDigestToContent);
  const content = createThreadContent([threadHead, ...threadBody]);
  return await fetch(`${process.env.TYPEFULLY_API_URL}/drafts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      content,
      share: true,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return { threadUrl: res.share_url };
    });
};
