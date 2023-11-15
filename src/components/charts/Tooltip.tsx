const MONTH_LONG_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

type MonthLongName = (typeof MONTH_LONG_NAMES)[number];

const getMonthFullName = (index: number): MonthLongName => {
  return MONTH_LONG_NAMES[index];
};

const Tooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: any;
}) => {
  const year = new Date().getFullYear();
  if (active && payload && payload.length) {
    return (
      <div className="overflow-hidden  rounded-lg bg-white shadow p-3 flex flex-col gap-2">
        <p className="text-sm text-gray-500">{`${getMonthFullName(
          label
        )} ${year}`}</p>
        <div className="flex items-center justify-start gap-2">
          <span className="w-[20px] h-[2px] bg-violet-400 content-[''] inline-block relative -bottom-[1px]" />
          <span className="text-sm">{payload[0].value} bookmarked </span>
        </div>
      </div>
    );
  }
};

export default Tooltip;
