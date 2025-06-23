'use client';

import * as React from 'react';
import type { SavedStudyPlan } from '@/lib/types';
import type { View } from '../main-layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import PlanCard from './plan-card';
import { Folder } from 'lucide-react';

interface MyPlansViewProps {
  savedPlans: SavedStudyPlan[];
  setActiveView: (view: View) => void;
  onViewPlan: (plan: SavedStudyPlan) => void;
}

const EmptyState = ({ setActiveView }: { setActiveView: (view: View) => void; }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card/50 p-12 text-center h-[calc(100vh-10rem)]">
      <Folder className="h-16 w-16 text-muted-foreground/30 mb-4" />
      <h3 className="text-2xl font-semibold tracking-tight">No Saved Plans Yet</h3>
      <p className="mt-2 max-w-md text-muted-foreground">
          Your saved study plans will appear here. Go to the Study Planner to generate your first one!
      </p>
      <button 
        onClick={() => setActiveView('study-planner')} 
        className="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        Go to Planner
      </button>
  </div>
);

export default function MyPlansView({ savedPlans, setActiveView, onViewPlan }: MyPlansViewProps) {
  
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-card px-4 md:px-6">
          <Icons.ListChecks className="h-6 w-6" />
          <h2 className="text-lg font-semibold">My Saved Plans</h2>
      </header>

      <ScrollArea className="h-[calc(100vh-3.5rem)]">
          <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            {savedPlans.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {savedPlans.map(plan => (
                        <PlanCard key={plan.id} plan={plan} onViewPlan={onViewPlan} />
                    ))}
                </div>
            ) : (
                <EmptyState setActiveView={setActiveView} />
            )}
          </main>
      </ScrollArea>
    </>
  );
}
