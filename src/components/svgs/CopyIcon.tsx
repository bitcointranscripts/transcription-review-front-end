import * as React from "react";
import { SVGProps } from "react";

const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16px"
    height="16px"
    viewBox="0 0 0.32 0.32"
    xmlns="http://www.w3.org/2000/svg"
    fill="#000000"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m0.08 0.08 0.02 -0.02h0.108L0.28 0.132V0.28l-0.02 0.02H0.1l-0.02 -0.02zm0.18 0.06 -0.06 -0.06H0.1v0.2h0.16z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.06 0.02 0.04 0.04v0.2l0.02 0.02V0.04h0.128l-0.02 -0.02z"
    />
  </svg>
);
export default CopyIcon;
