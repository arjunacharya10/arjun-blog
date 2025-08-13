"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export type HistBin = {
  x: number;
  label: string;
  count: number;
  color: string;
};

export default function Histogram({
  bins,
  title,
}: {
  bins: HistBin[];
  title: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        <span className="label">Distribution by trust</span>
      </div>
      <div className="w-full h-40 sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={bins}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              hide
              tickLine={false}
              axisLine={false}
              minTickGap={10}
            />
            <YAxis hide domain={[0, "auto"]} />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              formatter={(v: number, _n, p) => [
                v,
                (p?.payload?.x ?? 0).toFixed(0),
              ]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {bins.map((b, i) => (
                <Cell key={i} fill={b.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
