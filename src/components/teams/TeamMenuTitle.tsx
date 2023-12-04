const TeamMenuTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="flex flex-col gap-4 pb-4 pt-4">
      <div>
        <h3 className="text-3xl font-semibold leading-7">{title}</h3>
        <span className="text-sm text-gray-500 font-light block mt-4">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default TeamMenuTitle;
