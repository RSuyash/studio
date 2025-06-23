
"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CardDescription } from "../ui/card";

const chartData = [
  { month: "January", score: 82 },
  { month: "February", score: 78 },
  { month: "March", score: 95 },
  { month: "April", score: 105 },
  { month: "May", score: 98 },
  { month: "June", score: 112 },
];

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border rounded-lg shadow-lg">
        <p className="label font-semibold">{`${label}`}</p>
        <p className="intro" style={{color: chartConfig.score.color}}>{`Score : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


export default function PerformanceChart() {
    return (
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
           <LineChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[60, 120]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: "3 3" }}/>
                <Line
                    dataKey="score"
                    type="monotone"
                    stroke="var(--color-score)"
                    strokeWidth={2}
                    dot={{
                        fill: "var(--color-score)",
                        r: 4
                    }}
                    activeDot={{
                        r: 6,
                        strokeWidth: 2,
                        stroke: 'hsl(var(--background))'
                    }}
                />
            </LineChart>
        </ChartContainer>
    )
}
