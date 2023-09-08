export type TBlock = {
  type: 'rich_text';
  block_id: string;
  elements: { type: string; elements: { type: 'link'; url: string }[] }[];
};

export const extractLinksFromBlocks = (blocks: TBlock[]) => {
  const links: string[] = [];

  blocks
    ?.filter((block) => block.type === 'rich_text')
    .forEach((block) => {
      block.elements.forEach((element) => {
        element.elements.forEach((element) => {
          if (element.type === 'link') {
            links.push(element.url);
          }
        });
      });
    });

  return links;
};
