import {
  Mjml,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlText,
  MjmlWrapper,
  MjmlImage,
  MjmlButton,
} from 'mjml-react';

const InvitationEmail = ({
  url,
  teamName,
}: {
  url: string;
  teamName: string;
}) => (
  <Mjml>
    <MjmlBody width={500}>
      <MjmlWrapper>
        <MjmlSection>
          <MjmlColumn>
            <MjmlImage
              width="600px"
              align="center"
              src="https://digest.club/og-cover.png"
            />
            <MjmlText fontWeight={800} fontSize={20} align="center">
              You have been invited to join the {teamName} team!
            </MjmlText>
            <MjmlButton
              href={url}
              fontWeight={800}
              fontSize={16}
              align="center"
              backgroundColor="#B5FFD9"
              color="#415C4E"
            >
              Join {teamName}
            </MjmlButton>
            <MjmlText>
              {`If you're on a mobile device, you can also copy the link below
                and paste it into the browser of your choice.`}
            </MjmlText>
            <MjmlText>
              <a
                rel="nofollow"
                style={{
                  textDecoration: 'none',
                  color: `#847F7D !important`,
                }}
              >
                {url.replace(/^https?:\/\//, '')}
              </a>
            </MjmlText>
            <MjmlText>
              If you did not request this email, you can safely ignore it.
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
    </MjmlBody>
  </Mjml>
);

export default InvitationEmail;
