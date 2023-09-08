type Theme = {
  [key: string]: {
    fontSize: string;
    fontWeight: string;
    color: string;
    fontStyle?: string;
  };
};

const defaultTheme: Theme = {
  h1: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#000000',
  },
  h2: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#000000',
  },
  h3: {
    fontSize: '14px',
    fontWeight: 'normal',
    color: '#000000',
  },
  h4: {
    fontSize: '14px',
    fontWeight: 'normal',
    color: '#000000',
  },
  h5: {
    fontSize: '14px',
    fontWeight: 'normal',
    color: '#000000',
  },
  p: {
    fontSize: '13px',
    fontWeight: 'normal',
    color: '#333333',
  },
  ul: {
    fontSize: '13px',
    fontWeight: 'normal',
    color: '#333333',
  },
  ol: {
    fontSize: '13px',
    fontWeight: 'normal',
    color: '#333333',
  },
  li: {
    fontSize: '13px',
    fontWeight: 'normal',
    color: '#333333',
  },
  strong: {
    color: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'bold',
  },
  em: {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    fontStyle: 'italic',
    color: 'inherit',
  },
  i: {
    fontSize: 'inherit',
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
