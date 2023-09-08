import CreateTeam from '@/components/teams/form/CreateTeam';
export const dynamic = 'force-dynamic';

const CreatePage = () => {
  return (
    <div className="flex min-h-full justify-center items-center p-4 text-center sm:p-0">
      <div className="relative rounded-lg bg-white p-6 text-left shadow-xl w-full sm:max-w-md">
        <div className="sm:flex sm:items-start w-full">
          <h1 className="text-2xl font-bold leading-6 text-gray-900">
            Create New Team
          </h1>
        </div>
        <div className="mt-5 sm:mt-4 flex w-full">
          <CreateTeam />
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
