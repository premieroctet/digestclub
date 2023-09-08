import { formatDistance } from 'date-fns';

export const getRelativeDate = (date: string | Date) => {
  const formatDate = typeof date === 'string' ? new Date(date) : date;

  return formatDistance(formatDate, new Date(), {
    addSuffix: true,
  });
};
