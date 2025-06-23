'use client';

import type { SavedStudyPlan } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Target, Eye, Layers } from 'lucide-react';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

interface PlanCardProps {
  plan: SavedStudyPlan;
  onViewPlan: (plan: SavedStudyPlan) => void;
}

const Stat = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) => (
    <div className="flex items-center text-muted-foreground text-sm">
        <Icon className="h-4 w-4 mr-2" />
        <span className="font-medium text-foreground mr-1">{value}</span> {label}
    </div>
);

const examNameMap = {
    upsc: 'UPSC CSE',
    mpsc: 'MPSC Rajyaseva',
    ifos: 'IFoS',
    combined: 'Combined Focus'
};

export default function PlanCard({ plan, onViewPlan }: PlanCardProps) {
  const totalDays = plan.plan_data.plan.length;
  const examName = examNameMap[plan.input_details.exam] || 'Custom Plan';

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>
          Created on {format(new Date(plan.created_at), "MMMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2">
            <Stat icon={Layers} value={examName} label="Focus" />
            <Stat icon={Calendar} value={plan.input_details.timeframe} label="Duration" />
            <Stat icon={Clock} value={`${plan.input_details.hoursPerWeek}h`} label="per week" />
            <Stat icon={Target} value={totalDays} label={totalDays === 1 ? "day" : "days"} />
        </div>
        <div>
            <h4 className="font-semibold text-sm mb-2">Focus Areas:</h4>
            <div className="flex flex-wrap gap-2">
                {plan.input_details.focusAreas.split(',').map((area, index) => (
                    <Badge key={index} variant="secondary">{area.trim()}</Badge>
                ))}
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onViewPlan(plan)}>
            <Eye className="mr-2 h-4 w-4" />
            View Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
