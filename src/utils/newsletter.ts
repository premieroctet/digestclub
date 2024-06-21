import baseTheme from '@/emails/theme';

type Theme = {
  [key: string]: {
    fontSize: string;
    fontFamily?: string;
    fontWeight: string | number;
    color: string;
    fontStyle?: string;
    lineHeight?: string;
  };
};

const defaultTheme: Theme = {
  h1: {
    fontSize: '30px',
    fontFamily: baseTheme.fontFamily.heading,
    fontWeight: 700,
    color: baseTheme.colors.black,
    lineHeight: '1',
  },
  h2: {
    fontSize: '22px',
    fontFamily: baseTheme.fontFamily.heading,
    fontWeight: 600,
    color: baseTheme.colors.black,
    lineHeight: '1',
  },
  h3: {
    fontSize: '18px',
    fontFamily: baseTheme.fontFamily.heading,
    fontWeight: 600,
    color: baseTheme.colors.black,
    lineHeight: '1',
  },
  h4: {
    fontSize: '16px',
    fontFamily: baseTheme.fontFamily.heading,
    fontWeight: 600,
    color: baseTheme.colors.black,
    lineHeight: '1',
  },
  h5: {
    fontSize: '16px',
    fontFamily: baseTheme.fontFamily.heading,
    fontWeight: 600,
    color: baseTheme.colors.black,
    lineHeight: '1',
  },
  p: {
    fontSize: '14px',
    fontFamily: baseTheme.fontFamily.bodyPrimary,
    fontWeight: 'normal',
    color: baseTheme.colors.darkGray,
  },
  ul: {
    fontSize: '14px',
    fontFamily: baseTheme.fontFamily.bodyPrimary,
    fontWeight: 'normal',
    color: baseTheme.colors.darkGray,
  },
  ol: {
    fontSize: '14px',
    fontFamily: baseTheme.fontFamily.bodyPrimary,
    fontWeight: 'normal',
    color: baseTheme.colors.darkGray,
  },
  li: {
    fontSize: '14px',
    fontFamily: baseTheme.fontFamily.bodyPrimary,
    fontWeight: 'normal',
    color: baseTheme.colors.darkGray,
  },
  strong: {
    color: 'inherit',
    fontSize: 'inherit',
    fontFamily: baseTheme.fontFamily.bodyPrimary,
    fontWeight: 'bold',
  },
  em: {
    fontSize: 'inherit',
    fontFamily: baseTheme.fontFamily.bodyPrimary,
    fontWeight: 'inherit',
    fontStyle: 'italic',
    color: 'inherit',
  },
  i: {
    fontSize: 'inherit',
    fontFamily: baseTheme.fontFamily.bodyPrimary,
    fontWeight: 'inherit',
    fontStyle: 'italic',
    color: 'inherit',
  },
};

export function applyInlineStyleToRawHtml(
  html: string,
  theme: Theme = defaultTheme
) {
  return html.replace(/<(\/?(?!a\b)\w+)([^>]*)>/g, (match, tag, attributes) => {
    const tagStyle = theme[tag];
    /* Skip tags that are not in the theme */
    if (!tagStyle) return match;
    /* Skip closing tags */
    if (match.startsWith('</')) return match;
    /* Skip a and img tags as they might have custom attributes */
    if (tag === 'a' || tag === 'img') return match;

    let style = Object.entries(tagStyle)
      .map(([key, value]) => {
        const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${kebabKey}: ${value};`;
      })
      .join(' ');

    return `<${tag}${attributes} style="${style}">`;
  });
}
