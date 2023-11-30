'use server';
import client from '@/lib/db';
import { options } from '@/utils/nextadmin';
import { ActionParams } from '@premieroctet/next-admin';
import { submitForm } from '@premieroctet/next-admin/dist/actions';

export const submitFormAction = async (
  params: ActionParams,
  formData: FormData
) => {
  return submitForm({ ...params, options, prisma: client }, formData);
};
