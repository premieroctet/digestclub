import dynamic from 'next/dynamic';

export default dynamic(
  () => import('react-beautiful-dnd').then((res) => res.Droppable),
  { ssr: false }
);
