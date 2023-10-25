import Button from '@/components/Button';
import { useTeam } from '@/contexts/TeamContext';
import useCustomToast from '@/hooks/useCustomToast';
import api from '@/lib/api';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from 'react-query';

const SummaryButton = ({
  url,
  handleSuccess,
  hasAccess,
}: {
  url: string;
  handleSuccess: (text: string) => void;
  hasAccess: boolean;
}) => {
  const { successToast, errorToast } = useCustomToast();
  const { id: teamId } = useTeam();

  const { mutate: generateSummary, isLoading } = useMutation<
    AxiosResponse,
    AxiosError<ErrorResponse>,
    { url: string }
  >(
    'generate-bookmark-summary',
    ({ url }) => {
      return api.post(`/teams/${teamId}/bookmark/summary`, {
        url,
      });
    },
    {
      onSuccess: (response) => {
        successToast('Summary generated');
        handleSuccess(response.data);
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        errorToast(error.response?.data.error || 'Something went wrong');
      },
    }
  );

  if (!hasAccess) return null;

  return (
    <div className="flex flex-col items-end w-full">
      <div>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          icon={<LightBulbIcon />}
          onClick={() => {
            generateSummary({ url });
          }}
          isLoading={isLoading}
          loadingText="Generating"
        >
          Generate Summary
        </Button>
      </div>
    </div>
  );
};

export default SummaryButton;
