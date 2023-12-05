import { formatDate } from '@/utils/date';
import { BookmarkIcon } from '@heroicons/react/24/solid';
import NoContent from '../layout/NoContent';
import BlockCard from './block-card/BlockCard';
import { PublicDigestResult } from '@/services/database/digest';

export interface Props {
  digest: NonNullable<PublicDigestResult>;
}

export default function PublicDigestList({ digest }: Props) {
  return (
    <div className="bg-white p-4 md:p-0 pb-10 flex-col rounded-lg border border-gray-200">
      <div className="flex flex-col-reverse md:flex-row md:px-8 md:pt-8 md:justify-between md:items-start">
        <div className="flex flex-col md:mr-4 md:items-start">
          <div className="mb-4">
            <h2 className="text-4xl md:text-4xl font-bold">{digest.title}</h2>
            <div className="flex items-center mt-2">
              <span className="px-2 text-sm font-semibold bg-green-100 rounded-md">
                {`${
                  digest.digestBlocks.filter(
                    (block) => block.type === 'BOOKMARK'
                  )?.length
                } bookmark${digest.digestBlocks.length > 1 ? 's' : ''}`}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-center justify-center align-middle mt-2 md:mt-0">
          <div className="flex items-center gap-0">
            <span className="text-4xl md:text-5xl font-bold pr-2">
              {digest.publishedAt && formatDate(digest.publishedAt!, 'dd')}
            </span>
            <div className="font-semibold text-sm md:text-base">
              <span className="text-red-600 block whitespace-nowrap leading-none">
                {digest?.publishedAt && formatDate(digest.publishedAt!, 'EEEE')}
              </span>
              <span className="whitespace-nowrap leading-none">
                {digest?.publishedAt &&
                  formatDate(digest.publishedAt!, 'MMMM, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-2 md:px-10">
        {digest.description && (
          <p className="whitespace-pre-wrap mb-4 text-sm md:text-base w-full">
            {digest.description}
          </p>
        )}
      </div>
      <div className="mt-2 px-0 md:px-10 py-2 md:pb-8 w-full space-y-4">
        {digest.digestBlocks.length === 0 ? (
          <NoContent
            icon={<BookmarkIcon className="h-8 w-8" />}
            title="No bookmark"
            subtitle="There is no bookmark in this digest"
          />
        ) : (
          digest.digestBlocks.map((block, i) => {
            return <BlockCard key={i} block={block} index={i} />;
          })
        )}
      </div>
    </div>
  );
}
