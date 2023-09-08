import { toast } from 'react-hot-toast';

export const toastOptions = {};

const useCustomToast = () => {
  return {
    errorToast: (message: string) => {
      toast.error(message);
    },
    successToast: (message: string) => {
      toast.success(message);
    },
    infoToast: (message: string) => {
      toast(message);
    },
  };
};

export default useCustomToast;
