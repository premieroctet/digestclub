// contentlayer.config.ts
import { defineDocumentType, makeSource } from '@contentlayer/source-files';

export const Changelog = defineDocumentType(() => ({
  name: 'Changelog',
  filePathPattern: `**/*.md`,
  fields: {
    title: { type: 'string', required: true },
    publishedAt: { type: 'date', required: true },
    image: {
      type: 'string',
      required: false,
    },
    slug: { type: 'string', required: true },
  },
}));

export default makeSource({
  contentDirPath: 'changelogs',
  documentTypes: [Changelog],
});
