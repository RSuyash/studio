
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { type View } from '../main-layout';

export default function InsightsView({ setActiveView }: { setActiveView: (view: View) => void }) {
  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
        <Icons.Sparkles className="h-6 w-6" />
        <h2 className="text-lg font-semibold">UPSC Insights</h2>
      </header>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <main className="flex-1 space-y-8 p-4 md:p-6">
          
          <div>
            <h2 className="mb-4 text-2xl font-headline font-bold">Trends & Analysis</h2>
            <p className="text-muted-foreground mb-6">
              Explore data-driven insights into the UPSC CSE exam. More features are coming soon.
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-muted-foreground">PYQ Analysis</CardTitle>
                  <CardDescription>Topic-wise breakdown of Previous Year Questions.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                  <Button className="w-full" disabled>Coming Soon</Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-muted-foreground">Topic Weightage</CardTitle>
                  <CardDescription>Analysis of subject and topic importance over the years.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                  <Button className="w-full" disabled>Coming Soon</Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-muted-foreground">Cut-off Trends</CardTitle>
                  <CardDescription>Historical data on Prelims and Mains cut-off marks.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                  <Button className="w-full" disabled>Coming Soon</Button>
                </CardFooter>
              </Card>
            </div>
          </div>

        </main>
      </ScrollArea>
    </>
  );
}
