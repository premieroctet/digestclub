import {
  TeamBookmarksNotInDigestResult,
  getDigest,
  getTeamBookmarksNotInDigest,
  getTeamBySlug,
} from '@/lib/queries';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { BookmarkItem } from './BookmarkItem';

export type BookmarkListDndProps = {
  digest: NonNullable<Awaited<ReturnType<typeof getDigest>>>;
  team: Awaited<ReturnType<typeof getTeamBySlug>>;
  bookmarks: TeamBookmarksNotInDigestResult['bookmarks'];
};

const BookmarkListDnd = ({ bookmarks, team, digest }: BookmarkListDndProps) => {
  return (
    <Droppable droppableId="bookmark" type="bookmark">
      {(provided) => (
        <ul
          className="flex flex-col gap-2"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {bookmarks.map((bookmark, index) => {
            return (
              <Draggable
                key={bookmark.id}
                draggableId={bookmark.id}
                index={index}
              >
                {(provided) => (
                  <li
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <BookmarkItem
                      key={bookmark.id}
                      bookmark={bookmark}
                      teamSlug={team.slug}
                      teamId={team.id}
                      digestId={digest.id}
                      editMode
                    />
                  </li>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
};

export default BookmarkListDnd;
