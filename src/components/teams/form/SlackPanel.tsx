import Button from '@/components/Button';
import BadgeOnline from '@/components/layout/BadgeOnline';
import Link from '@/components/Link';
import { DeletePopover } from '@/components/Popover';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { Team } from '@prisma/client';
import { AiOutlineSlack } from '@react-icons/all-files/ai/AiOutlineSlack';
import { AxiosError } from 'axios';
import { useSearchParams } from 'next/navigation';
import { useMutation } from 'react-query';

const SlackPanel = ({ team }: { team: Team }) => {
  const searchParams = useSearchParams();
  const hasSlackConnected = team.slackTeamId && team.slackToken;

  const { refresh, isRefreshing } = useTransitionRefresh();
  const { successToast, errorToast } = useCustomToast();

  const { mutate: deleteSlackIntegration, isLoading } = useMutation(
    `delete-slack-integration-${team.id}`,
    () => api.delete(`/teams/connect/slack?teamId=${team.id}`),
    {
      onSuccess: () => {
        successToast('Slack integration has been deleted');
        refresh();
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        errorToast(
          error.response?.data?.error ||
            error.response?.statusText ||
            error.message
        );
      },
    }
  );

  return (
    <div>
      <label
        className="flex mt-4 items-center font-semibold mb-4 w-auto"
        htmlFor="teamImage"
      >
        <span className="relative flex items-center gap-2">
          Slack
          {hasSlackConnected && <BadgeOnline />}
        </span>
      </label>
      {searchParams?.get('error') === 'slack_team_already_connected' && (
        <div className="text-red-900 bg-red-100 px-3 py-1 rounded-md text-sm my-2">
          A team is already connected to this Slack account
        </div>
      )}
      {hasSlackConnected ? (
        <div
          style={{
            opacity: isLoading || isRefreshing ? 0.5 : 1,
          }}
          className="flex flex-col rounded-md text-sm border border-1 border-gray-300 text-center p-2 items-center gap-4"
        >
          <div>
            <span className="font-semibold text-base">
              Your Slack is connected
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Easily synchronize your desired channels by simply mentioning the{' '}
            <b className="text-gray-700">@digest.club</b> bot and importing
            links effortlessly!
          </p>
          <div
            className="w-full flex flex-col
            items-center content-center"
          >
            <DeletePopover
              handleDelete={deleteSlackIntegration}
              isLoading={isLoading || isRefreshing}
              trigger={
                <Button size="sm" variant="destructiveOutline">
                  Remove integration
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col rounded-md text-sm border border-1 border-gray-300 text-center p-6 items-center">
          <p className="pb-3 text-base">
            Import your links from Slack with ease
          </p>
          <Link
            icon={<AiOutlineSlack size="1.4rem" />}
            size="sm"
            href={`https://slack.com/oauth/v2/authorize?state=${team.id}&scope=commands%2Cusers%3Aread%2Cusers%3Aread.email%2Cchannels%3Ajoin%2Cchannels%3Aread%2Cchannels%3Ahistory%2Cgroups%3Ahistory&redirect_uri=${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/teams/connect/slack&client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}`}
          >
            Connect your slack
          </Link>
        </div>
      )}
    </div>
  );
};

export default SlackPanel;
