import {
  getDigest,
  getTeamBookmarksNotInDigest,
  getTeamBySlug,
} from '@/lib/queries';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import AddBookmarkItem from './AddBookmarkItem';

export type BookmarkListDndProps = {
  digest: NonNullable<Awaited<ReturnType<typeof getDigest>>>;
  team: Awaited<ReturnType<typeof getTeamBySlug>>;
  bookmarks: Awaited<
    ReturnType<typeof getTeamBookmarksNotInDigest>
  >['bookmarks'];
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
                    <AddBookmarkItem
                      key={bookmark.id}
                      bookmark={bookmark}
                      teamId={team.id}
                      digestId={digest.id}
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
