import { PropsWithChildren, ReactElement } from 'react';
import {
  Arrow,
  Content,
  Portal,
  Provider,
  Root,
  TooltipProps,
  Trigger,
} from '@radix-ui/react-tooltip';

interface IProps {
  trigger: ReactElement;
  side?: 'bottom' | 'top' | 'right' | 'left';
  asChild?: boolean;
}

export const Tooltip = ({
  trigger,
  children,
  side,
  asChild = false,
  ...tooltipProps
}: IProps & PropsWithChildren & TooltipProps) => {
  return (
    <Provider {...tooltipProps}>
      <Root>
        <Trigger asChild>{trigger}</Trigger>
        <Portal>
          <Content
            side={side || 'bottom'}
            sideOffset={5}
            className="shadow-md bg-gray-600 text-xs text-white rounded-md p-2 z-20"
          >
            {children}
            <Arrow className="fill-gray-600" />
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
};
