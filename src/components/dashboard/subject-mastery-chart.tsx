
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { subject: "History", progress: 75 },
  { subject: "Geography", progress: 50 },
  { subject: "Polity", progress: 80 },
  { subject: "Economy", progress: 60 },
  { subject: "Ethics", progress: 90 },
  { subject: "Science", progress: 45 },
];

const chartConfig = {
  progress: {
    label: "Progress",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function SubjectMasteryChart() {
    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
           <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <YAxis
                    dataKey="subject"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 10)}
                    className="fill-muted-foreground text-xs"
                />
                <XAxis dataKey="progress" type="number" hide />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                    dataKey="progress"
                    layout="vertical"
                    fill="var(--color-progress)"
                    radius={5}
                />
            </BarChart>
        </ChartContainer>
    )
}
