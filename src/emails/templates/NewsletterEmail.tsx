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
  MjmlHead,
  MjmlBreakpoint,
} from 'mjml-react';
import React from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import theme from '../theme';

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
            fontWeight={600}
            fontSize={16}
            align="left"
            paddingBottom={5}
            color={theme.colors.darkGray}
          >
            <a
              href={url!}
              target="_blank"
              style={{ color: 'unset', textDecoration: 'unset' }}
            >
              <span>{title}</span>

              {url && (
                <>
                  <span>{' · '}</span>
                  <span
                    style={{
                      color: theme.colors.primary,
                      fontWeight: 400,
                      fontSize: 14,
                      boxShadow: `0px 0px 0px 1px ${theme.colors.primary}`,
                      borderRadius: '16px',
                      padding: '4px 6px',
                      backgroundColor: 'rgba(109,40,217,0.1)',
                    }}
                  >
                    {url.replace(/^https?:\/\//, '').split('/')[0]}
                  </span>
                </>
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
        {description && (
          <MjmlText color={theme.colors.lightGray}>{description}</MjmlText>
        )}
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
      paddingLeft={10}
      paddingRight={10}
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
        <MjmlAll padding={'5px'} fontFamily={theme.fontFamily.bodyPrimary} />
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
              color={theme.colors.primary}
              fontFamily={theme.fontFamily.heading}
            >
              {title}
            </MjmlText>

            <MjmlText
              fontSize={14}
              fontWeight={400}
              lineHeight="20px"
              fontFamily={theme.fontFamily.bodyPrimary}
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
              fontFamily={theme.fontFamily.bodyPrimary}
              color={theme.colors.lightGray}
            >
              You received this email because you subscribed to this newsletter
              at{' '}
              <a
                href={hostUrl}
                style={{ color: `${theme.colors.primary} !important` }}
              >
                digest.club
              </a>
              . If you{"'"}d like to unsubscribe, click{' '}
              <a
                // `params.email` interpolation is done by sendinblue
                href={`${hostUrl}/unsubscribe?email={{params.email}}&teamId=${teamId}`}
                rel="nofollow"
                style={{ color: `${theme.colors.primary} !important` }}
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
