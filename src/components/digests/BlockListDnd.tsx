'use client';
import { getDigest, getTeamBySlug } from '@/lib/queries';
import { Draggable } from 'react-beautiful-dnd';
import Droppable from '../Droppable';
import NoContent from '../layout/NoContent';
import { BsFillBookmarkFill } from '@react-icons/all-files/bs/BsFillBookmarkFill';
import clsx from 'clsx';
import BlockCard from './block-card/BlockCard';
import AddTextBlockButton from './AddTextBlockButton';

export type BlockListDndProps = {
  digest: Awaited<ReturnType<typeof getDigest>>;
  team: Awaited<ReturnType<typeof getTeamBySlug>>;
};

export const BlockListDnd = ({ digest }: BlockListDndProps) => {
  return (
    <Droppable droppableId="block" type="bookmark">
      {(provided, snapshot) => (
        <ul
          {...provided.droppableProps}
          className={clsx(
            'flex flex-col w-full rounded-md border-dashed border space-y-5 p-2',
            snapshot.isDraggingOver ? 'border-indigo-300' : 'border-white'
          )}
          ref={provided.innerRef}
        >
          {digest?.digestBlocks && digest?.digestBlocks.length > 0 ? (
            digest?.digestBlocks.map((block, index) => {
              return (
                <div className="group/wrapper" key={block.id}>
                  <Draggable draggableId={block.id} index={index}>
                    {(provided) => (
                      <li
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="group relative flex flex-col w-full will-change-transform bg-white rounded-md"
                      >
                        <BlockCard block={block} isEditable />
                      </li>
                    )}
                  </Draggable>

                  <AddTextBlockButton position={block.order} />
                </div>
              );
            })
          ) : (
            <NoContent icon={<BsFillBookmarkFill />} title="No bookmark" />
          )}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
};
