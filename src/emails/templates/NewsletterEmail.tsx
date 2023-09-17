import { applyInlineStyleToRawHtml } from '@/utils/newsletter';
import { BookmarkDigestStyle, DigestBlockType } from '@prisma/client';
import {
  Mjml,
  MjmlBody,
  MjmlColumn,
  MjmlImage,
  MjmlSection,
  MjmlText,
  MjmlWrapper,
  MjmlAttributes,
  MjmlAll,
  MjmlDivider,
  MjmlHead,
  MjmlBreakpoint,
} from 'mjml-react';
import React from 'react';
import { remark } from 'remark';
import html from 'remark-html';

const Bookmark = ({
  bookmark: { title, description, url, image, style },
}: {
  bookmark: NewsletterBookmark;
}): JSX.Element => {
  let isBlock = !!image && style == 'BLOCK';

  return (
    <MjmlSection>
      {title && (
        <MjmlColumn width="100%">
          <MjmlText
            fontWeight={800}
            fontSize={16}
            align="left"
            paddingBottom={5}
          >
            <a
              href={url!}
              target="_blank"
              style={{ color: 'unset', textDecoration: 'unset' }}
            >
              {title}

              {url && (
                <span style={{ color: 'rgb(148, 163, 184)' }}>
                  {' · '}
                  {url.replace(/^https?:\/\//, '').split('/')[0]}
                </span>
              )}
            </a>
          </MjmlText>
        </MjmlColumn>
      )}

      {isBlock && (
        <MjmlColumn width="40%">
          <MjmlImage src={image!} alt={title || 'Bookmark'} />
        </MjmlColumn>
      )}

      <MjmlColumn width={isBlock ? '60%' : '100%'}>
        {description && <MjmlText>{description}</MjmlText>}
      </MjmlColumn>

      <MjmlColumn width="100%">
        <MjmlDivider borderWidth={1} borderColor="#d1d5db" />
      </MjmlColumn>
    </MjmlSection>
  );
};

const Raw = ({ html }: { html: string }) => {
  return React.createElement('mj-raw', {
    dangerouslySetInnerHTML: {
      __html: html,
    },
  });
};

const Text = ({ block: { text } }: { block: NewsletterText }): JSX.Element => {
  const htmlContent = remark().use(html).processSync(text);
  return (
    <MjmlSection
      paddingLeft={25}
      paddingRight={25}
      paddingBottom={10}
      paddingTop={10}
    >
      <MjmlColumn width="100%">
        <Raw html={applyInlineStyleToRawHtml(htmlContent.toString())} />
      </MjmlColumn>
    </MjmlSection>
  );
};

const BlockType = {
  BOOKMARK: DigestBlockType.BOOKMARK,
  TEXT: DigestBlockType.TEXT,
};

type NewsletterBookmark = {
  type: typeof BlockType.BOOKMARK;
  title: string | null;
  description: string | null;
  url: string | null;
  image: string | null;
  style: BookmarkDigestStyle;
};

type NewsletterText = {
  type: typeof BlockType.TEXT;
  text: string;
  style: BookmarkDigestStyle;
};

type NewsletterBlock = NewsletterBookmark | NewsletterText;

const NewsletterEmail = ({
  title,
  description,
  blocks,
  teamId,
  hostUrl,
}: {
  title: string | null;
  description: string | null | undefined;
  blocks?: NewsletterBlock[];
  teamId: string;
  hostUrl: string;
}): JSX.Element => (
  <Mjml>
    <MjmlHead>
      <MjmlBreakpoint width={481} />
      <MjmlAttributes>
        <MjmlAll padding={'5px'} fontFamily={'Cantarell, sans-serif'} />
      </MjmlAttributes>
    </MjmlHead>
    <MjmlBody backgroundColor="#F1F5F9" cssClass="mt-1">
      <MjmlWrapper backgroundColor="white" borderRadius={10} cssClass="mt-1">
        <MjmlSection>
          <MjmlColumn width="100%">
            <MjmlText
              fontWeight={800}
              fontSize={26}
              align="left"
              paddingBottom={16}
            >
              {title}
            </MjmlText>

            <MjmlText
              fontSize={14}
              fontWeight={400}
              lineHeight="20px"
              paddingTop={16}
            >
              {description}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        {blocks?.length &&
          blocks.map((block, i) => {
            if (block.type === BlockType.BOOKMARK) {
              if (block.style === 'TWEET_EMBED') {
                // maybe render tweets with their own component? to cleanly embed
                return <Bookmark bookmark={block} key={i} />;
              } else {
                return <Bookmark bookmark={block} key={i} />;
              }
            } else if (block.type === BlockType.TEXT) {
              return <Text block={block} key={i} />;
            }
          })}
        <MjmlSection>
          <MjmlColumn width={'100%'}>
            <MjmlText
              fontSize={14}
              fontWeight={400}
              lineHeight="20px"
              paddingTop={16}
              color="rgb(148, 163, 184)"
            >
              You received this email because you subscribed to this newsletter
              at{' '}
              <a href={hostUrl} style={{ color: '#6D28D9 !important' }}>
                digest.club
              </a>
              . If you{"'"}d like to unsubscribe, click{' '}
              <a
                // `params.email` interpolation is done by sendinblue
                href={`${hostUrl}/unsubscribe?email={{params.email}}&teamId=${teamId}`}
                rel="nofollow"
                style={{ color: '#6D28D9 !important' }}
              >
                here
              </a>
              .
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
    </MjmlBody>
  </Mjml>
);

export default NewsletterEmail;
