import React from 'react';
import Image from 'next/image';

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
      className="relative w-2/3 xs:w-[13rem] "
      src={img}
      alt=""
    />
    <div>
      <span className="font-[800] text-2xl pt-4 pb-1 border-b-black border-b-4 mb-3 inline-block pr-5">
        {title}
      </span>
      <div className="text-base">{description}</div>
    </div>
  </div>
);

const HomeSteps = () => {
  return (
    <div className="p-4 m-auto max-w-5xl pt-10 pb-20 text-gray-900 w-full h-full flex flex-col items-center">
      <h2 className="pb-12 font-[800] text-2xl lg:text-3xl text-center flex flex-col ">
        <span>{'Create or join your team’s feed.'}</span>
        <span>{'Share the good stuff with others.'}</span>
      </h2>
      <div className="flex max-lg:flex-col lg:space-x-10 max-lg:space-y-12">
        <Step
          title={'1. Collect'}
          img="/collect.svg"
          description={
            'Add links manually or synchronize your account with external services'
          }
        />
        <Step
          title={'2. Organize'}
          img="/organize.svg"
          description={
            'Make your personal selection of interesting content you want to share'
          }
        />
        <Step
          title={'3. Publish'}
          img="/publish.svg"
          description={
            'Set an automatic publication frequency or publish manually your digest'
          }
        />
      </div>
    </div>
  );
};

export default React.memo(HomeSteps);
