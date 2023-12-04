'use client';

import { Subscription } from '@prisma/client';
import ListItem from '../TabsListItem';
import NoContent from '@/components/layout/NoContent';
import { EnvelopeIcon } from '@heroicons/react/24/solid';

type Props = {
  subscriptions: Subscription[];
};

const SubscribersList = ({ subscriptions }: Props) => {
  return (
    <div className="flex flex-col gap-2 pt-4">
      {subscriptions.length === 0 ? (
        <NoContent
          icon={<EnvelopeIcon className="h-10 w-10" />}
          title="No subscribers"
          subtitle="Your team's newsletter has no subscribers yet."
        />
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

export default SubscribersList;
