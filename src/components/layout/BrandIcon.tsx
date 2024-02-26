import { SVGProps } from 'react';

const BrandIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    viewBox="0 0 810 810"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M12 273v530h527c149.117 0 270-120.883 270-270V287c0-149.117-120.883-270-270-270H273v256H12Zm261 0v333l136.5-104L546 606V273H273Z"
      clipRule="evenodd"
    />
  </svg>
);

export default BrandIcon;
