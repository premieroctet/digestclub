'use client';
import { RssIcon } from '@heroicons/react/24/solid';
import {
  Arrow,
  Content,
  Portal,
  Provider,
  Root,
  Trigger,
} from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import { forwardRef, HTMLProps, SVGProps, useState } from 'react';

type Props = {
  copyText: string;
} & HTMLProps<HTMLDivElement>;

const RssButton = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { className, copyText, ...rest } = props;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyText);
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Provider>
      <Root open={isOpen} disableHoverableContent>
        <Trigger asChild className="relative" onClick={copyToClipboard}>
          <div
            ref={ref}
            {...rest}
            className={clsx(
              'relative space-x-1 h-8 text-violet-700 cursor-pointer ring-1 ring-violet-700 rounded-md p-1 shadow-md active:shadow-inner flex',
              className
            )}
          >
            <span className="font-semibold">RSS</span>
            <RssIcon className="w-5" />
          </div>
        </Trigger>
        <Portal>
          <Content
            side="bottom"
            sideOffset={5}
            className="TooltipContent select-none rounded-md bg-emerald-500 shadow-lg text-xs text-white p-2 will-change-[transform,opacity]"
          >
            Copied RSS feed to clipboard !
            <Arrow className="fill-emerald-500" />
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
});

RssButton.displayName = 'RssButton';
export default RssButton;
