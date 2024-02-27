import Image from 'next/image';
import React from 'react';
import Section from './Section';

type StepProps = {
  title: string;
  img: string;
  description: string;
};

const Step = ({ title, img, description }: StepProps) => (
  <div className="flex flex-col space-y-8 xs:flex-row xs:space-x-8 lg:space-x-0 lg:space-y-8 lg:flex-col max-xs:items-center">
    <Image
      width={70}
      height={0}
      className="relative w-3/5 xs:w-[13rem] "
      src={img}
      alt="Digest"
    />
    <div className="text-center xs:text-left">
      <span className="font-[800] text-2xl pt-4 pb-1 border-b-black border-b-4 mb-3 inline-block pr-5">
        {title}
      </span>
      <div className="text-base">{description}</div>
    </div>
  </div>
);

const HomeSteps = () => {
  return (
    <Section
      title="Supercharge your Team knowledge"
      caption="Easily capture valuable links, categorize resources for efficient access, and distribute curated content seamlessly with our digest feature."
      className="max-w-5xl"
    >
      <div className="flex max-lg:flex-col lg:space-x-10 max-lg:space-y-12">
        <Step
          title="1. Collect Links"
          img="/collect.svg"
          description={
            'Add links manually or synchronize your account with external services'
          }
        />
        <Step
          title="2. Organize"
          img="/organize.svg"
          description={
            'Make your personal selection of interesting content you want to share'
          }
        />
        <Step
          title="3. Share Digest"
          img="/publish.svg"
          description={
            'Share your digest with a public link or via the newsletter feature'
          }
        />
      </div>
    </Section>
  );
};

export default React.memo(HomeSteps);
