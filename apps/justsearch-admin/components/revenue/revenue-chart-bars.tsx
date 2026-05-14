import { Cell } from "recharts";

interface RevenueChartBarsProps {
  dataLength: number;
}

export function RevenueChartBars({ dataLength }: RevenueChartBarsProps) {
  const lastIndex = dataLength - 1;

  return (
    <>
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      {Array.from({ length: dataLength }).map((_, index) => (
        <Cell
          key={`cell-${index}`}
          fill={index === lastIndex ? "url(#barGradientActive)" : "url(#barGradient)"}
        />
      ))}
    </>
  );
}
