import { getTweetId } from '@/utils/link';
import clsx from 'clsx';
import { Tweet } from 'react-tweet';
import * as Sentry from '@sentry/nextjs';
import styles from './Tweet.module.css';

function CardStyleTweet({
  url,
  panelSlot,
}: {
  url: string;
  panelSlot: React.ReactNode;
}) {
  const tweetId = getTweetId(url);
  if (!tweetId) {
    Sentry.captureMessage(
      `BlockBookmarkCard: Tweet Embed style but no tweetId found in url: ${url}`
    );
    return null;
  }

  const hasPanel = Boolean(panelSlot);

  return (
    <div className="group relative flex w-full overflow-hidden py-1 max-md:flex-row">
      <div
        data-theme="light"
        className={clsx(
          'flex-1 flex flex-col md:flex-row max-w-[100%]',
          styles.tweet
        )}
      >
        <Tweet id={tweetId} />
      </div>

      {hasPanel && panelSlot}
    </div>
  );
}

export default CardStyleTweet;
