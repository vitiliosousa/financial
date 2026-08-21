export function Logo({
  width = 22,
  height = 18,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M174.01 12.749C190.158 30.5093 200 54.1052 200 80C200 112.712 184.293 141.755 160.009 160H41.4248L86.3828 110.068C90.5342 111.951 95.1447 113 100 113C118.225 113 133 98.2254 133 80C133 73.9136 131.35 68.2133 128.477 63.3184L174.01 12.749ZM113.617 49.9316C109.466 48.0486 104.855 47 100 47C81.7746 47 67 61.7746 67 80C67 86.0864 68.6498 91.7867 71.5234 96.6816L25.9902 147.251C9.84239 129.491 0 105.895 0 80C0 47.2877 15.7075 18.2445 39.9912 0H158.577L113.617 49.9316Z"
        fill="currentColor"
      />
    </svg>
  );
}
