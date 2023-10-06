import { formatDistance, format, parseISO } from 'date-fns';

export const getRelativeDate = (date: string | Date) => {
  const formatDate = typeof date === 'string' ? new Date(date) : date;

  return formatDistance(formatDate, new Date(), {
    addSuffix: true,
  });
};

export const formatDate = (
  date: string | Date,
  dateFormat = 'MMMM dd, yyyy'
) => {
  if (date instanceof Date) {
    return format(date, dateFormat);
  }

  return format(parseISO(date), dateFormat);
};
