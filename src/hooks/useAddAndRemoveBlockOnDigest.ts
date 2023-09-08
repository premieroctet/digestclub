import api from '@/lib/api';
import { OrderData } from '@/pages/api/teams/[teamId]/digests/[digestId]/order';
import { BookmarkDigestStyle, DigestBlockType } from '@prisma/client';
import { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import useCustomToast from './useCustomToast';
import useTransitionRefresh from './useTransitionRefresh';

interface Params {
  teamId: string;
  digestId: string;
}

/**
 * Hook to add and remove blocks on a digest
 */
function useAddAndRemoveBlockOnDigest({ teamId, digestId }: Params) {
  const { errorToast } = useCustomToast();
  const { isRefreshing, refresh } = useTransitionRefresh();

  const mutateRemove = useMutation<
    AxiosResponse,
    AxiosError<ErrorResponse>,
    string
  >(
    'remove-block',
    (blockId: string) =>
      api.delete(`/teams/${teamId}/digests/${digestId}/block/${blockId}`),
    {
      onSuccess: refresh,
      onError: (error: AxiosError<ErrorResponse>) => {
        errorToast(
          error.response?.data?.error ||
            error.response?.statusText ||
            error.message
        );
      },
    }
  );

  interface muteAddParams {
    bookmarkId: string;
    position?: number;
    type?: DigestBlockType;
    style?: BookmarkDigestStyle;
  }
  const mutateAdd = useMutation<
    AxiosResponse,
    AxiosError<ErrorResponse>,
    muteAddParams
  >(
    'add-block',
    ({ bookmarkId, position, type = DigestBlockType.BOOKMARK, style }) => {
      console.log(
        {
          bookmarkId,
          position,
          type,
          style,
        },
        'add-block'
      );
      return api.post(`/teams/${teamId}/digests/${digestId}/block`, {
        bookmarkId,
        position,
        type,
        style,
      });
    },
    {
      onSuccess: refresh,
      onError: (error) => {
        errorToast(
          error.response?.data?.error ||
            error.response?.statusText ||
            error.message
        );
      },
    }
  );

  const mutateOrder = useMutation<
    OrderData,
    AxiosError<ErrorResponse>,
    OrderData
  >(
    (data: OrderData) =>
      api.post(`/teams/${teamId}/digests/${digestId}/order`, data),
    {
      onSuccess: refresh,
      onError: (error: AxiosError<ErrorResponse>) => {
        errorToast(
          error.response?.data?.error ||
            error.response?.statusText ||
            error.message
        );
      },
    }
  );

  return {
    add: mutateAdd,
    remove: mutateRemove,
    order: mutateOrder,
    isRefreshing,
  };
}

export default useAddAndRemoveBlockOnDigest;
