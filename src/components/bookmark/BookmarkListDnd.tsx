import { TeamBookmarkedLinks, getDigest, getTeamBySlug } from '@/lib/queries';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { BookmarkItem } from './BookmarkItem';

export type BookmarkListDndProps = {
  digest: NonNullable<Awaited<ReturnType<typeof getDigest>>>;
  team: Awaited<ReturnType<typeof getTeamBySlug>>;
  bookmarkedLinks: TeamBookmarkedLinks;
};

const BookmarkListDnd = ({
  bookmarkedLinks,
  team,
  digest,
}: BookmarkListDndProps) => {
  return (
    <Droppable droppableId="bookmark" type="bookmark">
      {(provided) => (
        <ul
          className="flex flex-col gap-2"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {bookmarkedLinks?.map((bookmarkedLink, index) => {
            return (
              <Draggable
                key={bookmarkedLink.id}
                draggableId={bookmarkedLink.id}
                index={index}
              >
                {(provided) => (
                  <li
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <BookmarkItem
                      key={bookmarkedLink.id}
                      bookmarkedLink={bookmarkedLink}
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
