import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const useTransitionRefresh = () => {
  const [isRefreshing, startTransition] = useTransition();
  const { refresh } = useRouter();

  return {
    isRefreshing,
    refresh: () => {
      startTransition(() => {
        refresh();
      });
    },
  };
};

export default useTransitionRefresh;
