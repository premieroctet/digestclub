import TemplateItem from '@/components/digests/templates/TemplateItem';
import { Team } from '@prisma/client';
import NoContent from '@/components/layout/NoContent';
import { ViewColumnsIcon } from '@heroicons/react/24/outline';
import { TeamDigestsResult } from '@/services/database/digest';

const TeamTemplates = ({
  team,
  templates,
}: {
  team: Team;
  templates: TeamDigestsResult[];
}) => {
  return (
    <div className="flex gap-6 flex-col pt-6">
      {templates?.map((template) => (
        <TemplateItem key={template?.id} template={template} team={team} />
      ))}
      {!templates?.length && (
        <NoContent
          icon={<ViewColumnsIcon className="w-12 h-12" />}
          title="No templates"
          subtitle="Your team does not have templates yet, create one from one of your digest edition page"
        />
      )}
    </div>
  );
};

export default TeamTemplates;
