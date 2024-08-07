import { getDigest } from '@/services/database/digest';
import { TeamLinks } from '@/services/database/link';
import { getTeamBySlug } from '@/services/database/team';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { BookmarkItem } from './BookmarkItem';

export type BookmarkListDndProps = {
  digest: NonNullable<Awaited<ReturnType<typeof getDigest>>>;
  team: Awaited<ReturnType<typeof getTeamBySlug>>;
  teamLinks: TeamLinks;
};

const BookmarkListDnd = ({ teamLinks, team, digest }: BookmarkListDndProps) => {
  return (
    <Droppable droppableId="bookmark" type="bookmark">
      {(provided) => (
        <ul
          className="flex flex-col gap-2"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {teamLinks?.map((teamLink, index) => {
            return (
              <Draggable
                key={teamLink.id}
                draggableId={teamLink?.bookmark[0]?.id}
                index={index}
              >
                {(provided) => (
                  <li
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <BookmarkItem
                      key={teamLink.id}
                      teamLink={teamLink}
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
