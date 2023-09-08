import { linksByDay } from '@/lib/adminQueries';
import { Card, Title, AreaChart } from '@tremor/react';
import { useMemo } from 'react';

type Props = {
  data: {
    linksByDay: Awaited<ReturnType<typeof linksByDay>>;
  };
};

const LinksOverTime = ({ data }: Props) => {
  const formattedData = useMemo(
    () =>
      // @ts-expect-error
      [...Array(new Date().getDate() + 1).keys()].map((day) => {
        const date = new Date();
        date.setDate(day);
        return {
          day: date.toLocaleString('default', { dateStyle: 'short' }),
          Liens:
            data.linksByDay.find(
              (link) => new Date(link.createdat).getDate() === day
            )?.count || 0,
        };
      }),
    [data]
  );

  return (
    <Card>
      <Title>Liens</Title>
      <AreaChart
        className="h-72 mt-4"
        data={formattedData}
        index="day"
        allowDecimals={false}
        categories={['Liens']}
        colors={['purple']}
      />
    </Card>
  );
};

export default LinksOverTime;
