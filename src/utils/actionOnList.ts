export const reorderList = (list: any[], from: number, to: number) => {
  const newList = [...list];
  const [item] = newList.splice(from, 1);
  newList.splice(to, 0, item);
  return newList;
};

export const insertInList = (list: any[], item: any, position: number) => {
  const newList = [...list];
  newList.splice(position, 0, item);
  return newList;
};
