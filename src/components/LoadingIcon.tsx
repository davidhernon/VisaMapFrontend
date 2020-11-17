const LoadingSvg = () => (
  <svg
    width="54px"
    height="54px"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <circle
      cx="50"
      cy="50"
      r="32"
      strokeWidth="8"
      stroke="#64b5f6"
      strokeDasharray="50.26548245743669 50.26548245743669"
      fill="none"
      strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        dur="1.6949152542372878s"
        repeatCount="indefinite"
        keyTimes="0;1"
        values="0 50 50;360 50 50"
      ></animateTransform>
    </circle>
    <circle
      cx="50"
      cy="50"
      r="23"
      strokeWidth="8"
      stroke="#2bd47d"
      strokeDasharray="36.12831551628262 36.12831551628262"
      strokeDashoffset="36.12831551628262"
      fill="none"
      strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        dur="1.6949152542372878s"
        repeatCount="indefinite"
        keyTimes="0;1"
        values="0 50 50;-360 50 50"
      ></animateTransform>
    </circle>
  </svg>
);

export default LoadingSvg;
