import { AiOutlineLoading3Quarters as LoadingIcon } from '@react-icons/all-files/ai/AiOutlineLoading3Quarters';

interface ILoader {
  text?: string;
  fullPage?: boolean;
}
const Loader = ({ text, fullPage }: ILoader) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullPage ? 'w-full h-full' : 'w-auto h-auto'
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        {text && <p className="text-violet-700 font-semibold p-4">{text}</p>}
        <LoadingIcon
          className="animate-spin h-16 w-16 text-violet-600"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default Loader;
