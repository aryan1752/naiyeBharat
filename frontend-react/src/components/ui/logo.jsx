function Logo({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#3B82F6" />
      <path
        d="M35 65V35L50 45L65 35V65"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="8" fill="white" />
    </svg>
  );
}

export default Logo;