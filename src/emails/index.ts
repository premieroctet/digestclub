import { render } from 'mjml-react';
import nodemailer from 'nodemailer';
import { ReactElement } from 'react';

export const EMAIL_SUBJECTS = {
  LOGIN: 'Sign in to your account',
  INVITATION: 'You have been invited to join a team',
};

export const sendEmail = async ({
  to,
  subject,
  component,
}: {
  to: string;
  subject: string;
  component: ReactElement;
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT!,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
  });

  const { html } = render(component);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};
