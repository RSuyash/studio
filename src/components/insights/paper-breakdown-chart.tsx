"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ExamStats } from "@/lib/insights-utils"

interface PaperBreakdownChartProps {
    stats: ExamStats;
}

const chartConfig = {
    meritMains: {
        label: "Merit-Based (Mains)",
        color: "hsl(var(--chart-1))",
    },
    qualifying: {
        label: "Qualifying",
        color: "hsl(var(--chart-2))",
    },
    meritPrelims: {
        label: "Merit-Based (Prelims)",
        color: "hsl(var(--chart-5))",
    },
};

export default function PaperBreakdownChart({ stats }: PaperBreakdownChartProps) {
    const chartData = [
        { name: "meritMains", value: stats.meritPapersMains.value, description: stats.meritPapersMains.description },
        { name: "qualifying", value: stats.qualifyingPapers.value, description: stats.qualifyingPapers.description },
        { name: "meritPrelims", value: stats.meritPapersPrelims.value, description: stats.meritPapersPrelims.description },
    ].filter(d => d.value > 0);

    const totalPapers = stats.totalPapers.value;

    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Paper Distribution</CardTitle>
                <CardDescription>A breakdown of all written papers in the exam.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="description"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            {chartData.map((entry) => (
                                <Cell key={entry.name} fill={chartConfig[entry.name as keyof typeof chartConfig].color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardContent className="flex flex-col gap-2 text-sm">
                 <div className="flex items-center justify-center border-t pt-4">
                    <span className="text-lg font-bold">{totalPapers} Total Papers</span>
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-1 px-4 sm:grid-cols-3">
                     {chartData.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2">
                            <div
                                className="h-3 w-3 shrink-0 rounded-full"
                                style={{ backgroundColor: chartConfig[entry.name as keyof typeof chartConfig].color }}
                            />
                            <div className="flex-1">
                                <p className="font-medium">{entry.value} Papers</p>
                                <p className="text-xs text-muted-foreground">{entry.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
