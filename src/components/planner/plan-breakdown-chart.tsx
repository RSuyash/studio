'use client';

import * as React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { PlanAnalytics } from '@/lib/planner-analytics-utils';

interface PlanBreakdownChartProps {
  analytics: PlanAnalytics;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border rounded-lg shadow-lg text-sm">
        <p className="label font-bold mb-2">{`${label}`}</p>
        {payload.map((pld: any) => (
            <div key={pld.dataKey} style={{ color: pld.fill }}>
                {pld.name}: {pld.value.toFixed(1)} hrs
            </div>
        ))}
        <div className="border-t mt-2 pt-2 font-semibold">
           Total: {payload.reduce((sum: number, pld: any) => sum + pld.value, 0).toFixed(1)} hrs
        </div>
      </div>
    );
  }
  return null;
};

export default function PlanBreakdownChart({ analytics }: PlanBreakdownChartProps) {
  if (!analytics.paperBreakdown || analytics.paperBreakdown.length === 0) {
    return null; // Don't render the chart if there's no data
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hours Distribution by Paper</CardTitle>
        <CardDescription>
          A breakdown of how your study time is allocated across different papers and activities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={analytics.paperBreakdown} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
            <Legend wrapperStyle={{fontSize: "14px"}} />
            <Bar dataKey="study" stackId="a" name="Study" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revise" stackId="a" name="Revise" fill="hsl(var(--chart-2))" />
            <Bar dataKey="test" stackId="a" name="Test/Practice" fill="hsl(var(--chart-5))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
