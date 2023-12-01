import { getEnvHost } from '@/lib/server';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = {
  children: React.ReactNode;
};

const description =
  'The Frontpage of Teams Knowledge. Save and share your team’s curation.';
const title = `Digest.club`;

export const metadata: Metadata = {
  icons: { icon: '/favicon.ico' },
  title: {
    default: 'Digest.club - The Frontpage of Teams Knowledge',
    template: '%s | Digest.club',
  },
  description,
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${getEnvHost()}/og-cover.png`],
  },
  openGraph: {
    title,
    description,
    url: process.env.NEXTAUTH_URL,
    siteName: title,
    images: [
      {
        url: `${getEnvHost()}/og-cover.png`,
        width: 2400,
        height: 1200,
      },
    ],
    locale: 'en-GB',
    type: 'website',
  },
};

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="flex flex-col font-sans overflow-x-hidden bg-white">
        {children}
      </body>
    </html>
  );
}
