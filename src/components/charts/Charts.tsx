'use client';
import React from 'react';

import { Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';

import CustomTooltip from './Tooltip';
interface Props {
  teamLinksByMonth: Array<{
    month: number;
    link_count: number;
  }>;
}

type GraphData = Array<{
  month: (typeof MONTH_SHORT_NAMES)[number];
  amt: number;
}>;

const MONTH_SHORT_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
] as const;

function refinePropToData(props: Props['teamLinksByMonth']): GraphData {
  return MONTH_SHORT_NAMES.map((month, index) => {
    const monthData = props.find((d) => d.month === index + 1);
    return {
      month,
      amt: monthData ? monthData.link_count : 0,
    };
  });
}

export default function ClientCharts({ teamLinksByMonth }: Props) {
  const data = refinePropToData(teamLinksByMonth);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 0, right: 20, left: 20, bottom: 6 }}
      >
        <Tooltip content={<CustomTooltip />} />
        <Line
          baseLine={0}
          type="monotone"
          strokeWidth={2}
          dataKey="amt"
          stroke="#7C3AED80"
          dot={false}
          activeDot={{
            stroke: '#7C3AED80',
            strokeWidth: 2,
            r: 4,
            fill: '#FFF',
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
