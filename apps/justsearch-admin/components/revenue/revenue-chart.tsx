"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RevenueChartTooltip } from "./revenue-chart-tooltip";
import { RevenueChartBars } from "./revenue-chart-bars";
import { buildChartData } from "./revenue-chart-utils";

function formatYAxis(value: number) {
  return value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`;
}

interface RevenueChartProps {
  monthlyTrend: number[];
}

export function RevenueChart({ monthlyTrend }: RevenueChartProps) {
  const data = buildChartData(monthlyTrend);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Revenue Trend</h3>
        <span className="text-xs font-medium text-slate-400">Last 6 months</span>
      </div>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              content={<RevenueChartTooltip />}
              cursor={{ fill: "rgba(16, 185, 129, 0.06)" }}
            />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]} animationDuration={1000}>
              <RevenueChartBars dataLength={data.length} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
