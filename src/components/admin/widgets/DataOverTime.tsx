import { newDigestByMonth, newUsersByMonth } from '@/lib/adminQueries';
import { Card, Title, AreaChart } from '@tremor/react';
import { useMemo } from 'react';

type Props = {
  data: {
    newUsersByMonth: Awaited<ReturnType<typeof newUsersByMonth>>;
    newDigestByMonth: Awaited<ReturnType<typeof newDigestByMonth>>;
  };
};

const DataOverTime = ({ data }: Props) => {
  const formattedData = useMemo(
    () =>
      // @ts-expect-error
      [...Array(new Date().getMonth() + 1).keys()].map((month) => {
        const date = new Date();
        date.setMonth(month - 1);

        return {
          'month': date.toLocaleString('default', { month: 'long' }),
          'Nouveaux utilisateurs':
            data.newUsersByMonth.find(
              (newUser) => new Date(newUser.createdat).getMonth() === month
            )?.count || 0,
          'Nouveaux digests':
            data.newDigestByMonth.find(
              (newDigest) => new Date(newDigest.createdat).getMonth() === month
            )?.count || 0,
        };
      }),
    [data]
  );

  return (
    <Card>
      <Title>Acquisition</Title>
      <AreaChart
        className="h-72 mt-4"
        data={formattedData}
        index="month"
        categories={['Nouveaux utilisateurs', 'Nouveaux digests']}
        colors={['indigo', 'cyan']}
        allowDecimals={false}
      />
    </Card>
  );
};

export default DataOverTime;
