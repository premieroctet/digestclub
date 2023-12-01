const TeamMenuTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <span>
        <h3 className="text-3xl font-semibold leading-7 text-center">
          {title}
        </h3>
        <span className="text-sm text-gray-500 font-light text-center block mt-4">
          {subtitle}
        </span>
      </span>
    </div>
  );
};

export default TeamMenuTitle;
