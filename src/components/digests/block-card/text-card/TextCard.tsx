'use client';

import React, { useState } from 'react';
import { Props as PublicDigestListProps } from '../../PublicDigestList';
import { remark } from 'remark';
import html from 'remark-html';
import { useTeam } from '@/contexts/TeamContext';
import { useParams } from 'next/navigation';
import useAddAndRemoveBlockOnDigest from '@/hooks/useAddAndRemoveBlockOnDigest';
import ActionsBlockPopover from '../../ActionsBlockPopover';
import EditTextBlockDialog from '../../dialog/EditTextBlockDialog';
import cn from 'classnames';
export interface Props {
  block: PublicDigestListProps['digest']['digestBlocks'][number];
  isEditable?: boolean;
  index?: number;
}

export default function BlockTextCard({
  block,
  isEditable = false,
  index,
}: Props) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { id: teamId } = useTeam();
  const params = useParams();
  const { remove, isRefreshing } = useAddAndRemoveBlockOnDigest({
    teamId: teamId,
    digestId: params?.digestId as string,
  });

  if (!block.text) {
    throw new Error(
      'BlockTextCard: block.text is null, but it should not be null.'
    );
  }

  const htmlContent = remark().use(html).processSync(block.text);

  return (
    <div className="group relative flex w-full overflow-hidden py-1 max-md:flex-col justify-between">
      <span className="top-6 right-0 bg-slate-700 absolute"></span>
      <div className="'flex-1 flex flex-col md:flex-row max-w-[100%] gap-7 relative">
        <div className="w-full max-w-[100%]">
          {block.title && (
            <p className="text-lg font-semibold overflow-hidden text-ellipsis leading-6 bg-green-50 group-hover:bg-green-100 transition-colors inline pl-2 pr-2 py-1">
              {block.title}
            </p>
          )}
          {Boolean(block.text) && (
            <div
              className={cn(
                'prose prose-violet prose-sm prose-headings:mb-1 prose-headings:mt-3 prose-p:mt-1 prose-p:leading-relaxed',
                {
                  'first:prose-h1:mt-7': index !== 0 && !isEditable,
                }
              )}
              dangerouslySetInnerHTML={{
                __html: htmlContent.toString(),
              }}
            />
          )}
        </div>
      </div>
      {isEditable && (
        <>
          <ActionsBlockPopover
            isRemoving={remove.isLoading || isRefreshing}
            onRemoveClick={() => remove.mutate(block.id)}
            onEditClick={() => {
              setIsEditDialogOpen(true);
            }}
          />
          <EditTextBlockDialog
            isOpen={isEditDialogOpen}
            setIsOpen={setIsEditDialogOpen}
            bookmarkDigest={block}
            defaultValues={{
              text: block.text,
            }}
          />
        </>
      )}
    </div>
  );
}
