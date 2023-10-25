const TeamMenuTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <span>
        <h3 className="text-xl font-semibold leading-7">{title}</h3>
        <span className="text-sm text-gray-500 font-light">{subtitle}</span>
      </span>

      <div className="w-full border-t border-gray-300" />
    </div>
  );
};

export default TeamMenuTitle;
