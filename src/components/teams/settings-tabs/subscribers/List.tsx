import { Subscription } from '@prisma/client';
import ListItem from '../TabsListItem';

type Props = {
  subscriptions: Subscription[];
};

const List = ({ subscriptions }: Props) => {
  return (
    <div className="flex flex-col gap-2 pt-4">
      {subscriptions.length === 0 ? (
        <div className="flex items-center justify-start">
          <p className="mt-1 text-base text-gray-500">
            You have no subscribers to your newsletter.
          </p>
        </div>
      ) : (
        <>
          {subscriptions.map((subscription) => (
            <ListItem
              key={subscription.id}
              name={subscription.email}
              deleteItem={undefined}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default List;
