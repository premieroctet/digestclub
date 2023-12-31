const BookmarkCountBadge = ({ count }: { count: number }) => {
  return (
    <span className="bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-0.5 rounded">
      {count} bookmark
      {count === 1 ? '' : 's'}
    </span>
  );
};

export default BookmarkCountBadge;
