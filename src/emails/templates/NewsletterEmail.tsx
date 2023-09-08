import { applyInlineStyleToRawHtml } from '@/utils/newsletter';
import { DigestBlockType } from '@prisma/client';
import {
  Mjml,
  MjmlBody,
  MjmlButton,
  MjmlColumn,
  MjmlImage,
  MjmlSection,
  MjmlText,
  MjmlWrapper,
  MjmlGroup,
  MjmlDivider,
} from 'mjml-react';
import React from 'react';
import { remark } from 'remark';
import html from 'remark-html';

const Bookmark = ({
  bookmark,
}: {
  bookmark: NewsletterBookmark;
}): JSX.Element => {
  const { title, description, url, image } = bookmark;
  return (
    <MjmlSection>
      {image && (
        <MjmlColumn width="100%">
          <MjmlImage src={image} alt={title || 'Bookmark'} />
        </MjmlColumn>
      )}
      <MjmlColumn width="100%">
        {title && (
          <MjmlText
            fontWeight={800}
            fontSize={16}
            align="left"
            paddingBottom={5}
          >
            {title}
          </MjmlText>
        )}
        {description && <MjmlText>{description}</MjmlText>}
        {url && (
          <MjmlText color="rgb(148, 163, 184)">
            {url.replace(/^https?:\/\//, '').split('/')[0]}
          </MjmlText>
        )}
        {url && (
          <MjmlButton
            align="left"
            fontWeight={800}
            fontSize={16}
            backgroundColor="#7C3AED"
            color="white"
            href={url}
            rel="nofollow"
          >
            Visit bookmark
          </MjmlButton>
        )}
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

const Text = ({ text }: { text: NewsletterText['text'] }): JSX.Element => {
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
};

type NewsletterText = {
  type: typeof BlockType.TEXT;
  text: string;
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
    <MjmlBody width={500} backgroundColor="#F1F5F9" cssClass="mt-1">
      <MjmlSection></MjmlSection>
      <MjmlWrapper backgroundColor="white" borderRadius={10} cssClass="mt-1">
        <MjmlSection>
          <MjmlGroup>
            <MjmlColumn width={'100%'}>
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
          </MjmlGroup>
        </MjmlSection>
        {blocks?.length &&
          blocks.map((block, i) => {
            if (block.type === BlockType.BOOKMARK) {
              return <Bookmark bookmark={block} key={i} />;
            } else if (block.type === BlockType.TEXT) {
              return <Text text={block.text} key={i} />;
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
                href={`${hostUrl}/unsubscribe?email={{ params.email}}&teamId=${teamId}`}
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
      <MjmlSection></MjmlSection>
    </MjmlBody>
  </Mjml>
);

export default NewsletterEmail;
