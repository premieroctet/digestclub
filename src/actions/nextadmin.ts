'use server';
import client from '@/lib/db';
import { options } from '@/utils/nextadmin';
import { ActionParams, ModelName } from '@premieroctet/next-admin';
import {
  deleteResourceItems,
  submitForm,
  searchPaginatedResource,
  SearchPaginatedResourceParams,
} from '@premieroctet/next-admin/dist/actions';

export const submitFormAction = async (
  params: ActionParams,
  formData: FormData
) => {
  return submitForm({ ...params, options, prisma: client }, formData);
};

export const deleteItem = async (
  model: ModelName,
  ids: string[] | number[]
) => {
  return deleteResourceItems(client, model, ids);
};

export const searchResource = async (
  actionParams: ActionParams,
  params: SearchPaginatedResourceParams
) => {
  return searchPaginatedResource(
    { ...actionParams, options, prisma: client },
    params
  );
};
