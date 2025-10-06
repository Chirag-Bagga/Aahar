import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// each row in your dataset must look like this
export type NpkDatum = {
  name: string | undefined;     // e.g., "Nitrogen", "Phosphorus", "Potassium"
  Optimal: number | undefined;  // target value
  Current: number | undefined;  // measured value
};

interface NpkPlotProps {
  data: NpkDatum[];
  height?: number | string; // optional override (default 400)
  className?: string;
}

const NpkPlot: React.FC<NpkPlotProps> = ({ data, height = 400, className }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Optimal" />
          <Bar dataKey="Current" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NpkPlot;
