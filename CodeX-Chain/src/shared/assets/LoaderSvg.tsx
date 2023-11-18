import { useEffect } from "react";
import gsap from "gsap";

const LoaderSvg = ({ className }: { className?: string }) => {
  className = `${className ? className : ""} svg-loader-with-blue-dot`;

  useEffect(() => {
    gsap.to(".svg-loader-with-blue-dot", { rotation: 360, duration: 2, ease: "linear", repeat: -1 });
  }, [className]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={240}
      height={240}
      className={className}
      viewBox="0 0 240 240"
      fill="none"
    >
      <path
        opacity="0.1"
        d="M180 120C180 153.137 153.137 180 120 180C86.8629 180 60 153.137 60 120C60 86.8629 86.8629 60 120 60C153.137 60 180 86.8629 180 120ZM61.8 120C61.8 152.143 87.857 178.2 120 178.2C152.143 178.2 178.2 152.143 178.2 120C178.2 87.857 152.143 61.8 120 61.8C87.857 61.8 61.8 87.857 61.8 120Z"
        fill="white"
      />
      <g filter="url(#filter0_d_542_11112)">
        <path
          d="M120 60.0001C122.514 60.0001 125.026 60.1581 127.52 60.4732L127.294 62.259C124.875 61.9534 122.439 61.8001 120 61.8001V60.0001Z"
          fill="url(#paint0_linear_542_11112)"
          fillOpacity="0.7"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_542_11112"
          x={85}
          y="30.0001"
          width="77.5234"
          height="72.2589"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={5} />
          <feGaussianBlur stdDeviation="17.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.00392157 0 0 0 0 0.34902 0 0 0 0 0.866667 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_542_11112" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_542_11112" result="shape" />
        </filter>
        <linearGradient
          id="paint0_linear_542_11112"
          x1="68.3571"
          y1="172.762"
          x2="157.91"
          y2="48.7821"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#32B5FF" stopOpacity={0} />
          <stop offset="0.578125" stopColor="#001AFF" />
          <stop offset="0.963542" stopColor="#32B5FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default LoaderSvg;
