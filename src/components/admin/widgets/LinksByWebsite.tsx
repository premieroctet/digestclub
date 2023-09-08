import { linksByDomain } from '@/lib/adminQueries';
import { BarList, Card, Title, Bold, Flex, Text } from '@tremor/react';

type Props = {
  data: Awaited<ReturnType<typeof linksByDomain>>;
};

const LinksByWebsite = ({ data }: Props) => (
  <Card>
    <Title>Links by website</Title>
    <Flex className="mt-4">
      <Text>
        <Bold>Source</Bold>
      </Text>
      <Text>
        <Bold></Bold>
      </Text>
    </Flex>
    <BarList
      data={data.map((domain) => ({
        name: domain.url_domain,
        value: domain.count,
        href: `https://${domain.url_domain}`,
        // icon: function YouTubeIcon() {
        //   return (
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       className="mr-2.5 fill-red-500"
        //       viewBox="0 0 24 24"
        //       width="20"
        //       height="20"
        //     >
        //       <path fill="none" d="M0 0h24v24H0z" />
        //       <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z" />
        //     </svg>
        //   );
        // },
      }))}
      className="mt-2"
    />
  </Card>
);

export default LinksByWebsite;
