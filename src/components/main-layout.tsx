
"use client"

import * as React from 'react'
import dynamic from 'next/dynamic'

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Icons } from '@/components/icons'
import SyllabusViewer from '@/components/syllabus/syllabus-viewer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

type View = 'dashboard' | 'syllabus';

const SubjectMasteryChart = dynamic(
  () => import('@/components/dashboard/subject-mastery-chart'),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full" />
  }
)

const DashboardView = ({ setActiveView }: { setActiveView: (view: View) => void }) => {
    return (
        <>
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">Dashboard</h2>
                </div>
            </header>
            <main className="flex-1 space-y-6 p-4 md:p-6">
                <div className="mb-6">
                    <h1 className="font-headline text-3xl font-bold text-primary">Welcome back!</h1>
                    <p className="text-muted-foreground">Here's a summary of your learning journey.</p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Syllabus Progress</CardTitle>
                            <Icons.BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">75%</div>
                            <p className="text-xs text-muted-foreground">
                                You're on the right track!
                            </p>
                        </CardContent>
                        <CardFooter>
                           <Progress value={75} className="w-full" />
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Topics Mastered</CardTitle>
                            <Icons.Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">42</div>
                            <p className="text-xs text-muted-foreground">
                                2 expert, 15 advanced, 25 novice
                            </p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Mock Tests</CardTitle>
                            <Icons.PencilLine className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12</div>
                            <p className="text-xs text-muted-foreground">
                                +19% from last month
                            </p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Days to Prelims 2025</CardTitle>
                            <Icons.CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">245</div>
                            <p className="text-xs text-muted-foreground">
                                Stay focused and consistent.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Subject-wise Mastery</CardTitle>
                            <CardDescription>Your progress across key GS subjects.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <SubjectMasteryChart />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3">
                         <CardHeader>
                            <CardTitle>Your Toolkit</CardTitle>
                            <CardDescription>Quick access to your learning tools.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="flex items-center gap-4">
                                    <Icons.BookOpen className="h-6 w-6 text-primary" />
                                    <div>
                                        <p className="font-semibold">Syllabus Explorer</p>
                                        <p className="text-sm text-muted-foreground">Dive into the syllabus.</p>
                                    </div>
                                </div>
                                <Button size="sm" onClick={() => setActiveView('syllabus')}>Open</Button>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4 opacity-50">
                                 <div className="flex items-center gap-4">
                                    <Icons.Library className="h-6 w-6" />
                                    <div>
                                        <p className="font-semibold">My Resources</p>
                                        <p className="text-sm text-muted-foreground">Coming soon.</p>
                                    </div>
                                </div>
                                <Button size="sm" disabled>Open</Button>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4 opacity-50">
                                 <div className="flex items-center gap-4">
                                    <Icons.Sparkles className="h-6 w-6" />
                                    <div>
                                        <p className="font-semibold">Mock Test Generator</p>
                                        <p className="text-sm text-muted-foreground">Coming soon.</p>
                                    </div>
                                </div>
                                <Button size="sm" disabled>Open</Button>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4 opacity-50">
                                 <div className="flex items-center gap-4">
                                    <Icons.Layers className="h-6 w-6" />
                                    <div>
                                        <p className="font-semibold">Flashcard Maker</p>
                                        <p className="text-sm text-muted-foreground">Coming soon.</p>
                                    </div>
                                </div>
                                <Button size="sm" disabled>Open</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    )
}

const SyllabusView = () => {
    return (
        <>
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">Syllabus Explorer</h2>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-6">
                <SyllabusViewer />
            </main>
        </>
    )
}

export default function MainLayout() {
  const [activeView, setActiveView] = React.useState<View>('dashboard');

  const menuItems = [
    { view: 'dashboard', label: 'Dashboard', icon: Icons.LayoutDashboard },
    { view: 'syllabus', label: 'Syllabus Explorer', icon: Icons.BookOpen },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icons.Logo className="size-5" />
            </div>
            <h1 className="font-headline text-xl font-bold text-primary group-data-[collapsible=icon]:hidden">Nexus Cortex</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.view}>
                <SidebarMenuButton
                  isActive={activeView === item.view}
                  onClick={() => setActiveView(item.view as View)}
                  className="w-full"
                  tooltip={item.label}
                >
                  <item.icon className="size-4" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarSeparator />
          <SidebarGroup className="p-2">
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full" disabled tooltip="Coming soon!">
                <Icons.Library className="size-4" />
                <span className="group-data-[collapsible=icon]:hidden">My Resources</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full" disabled tooltip="Coming soon!">
                <Icons.Sparkles className="size-4" />
                <span className="group-data-[collapsible=icon]:hidden">Mock Test Generator</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full" disabled tooltip="Coming soon!">
                <Icons.Layers className="size-4" />
                <span className="group-data-[collapsible=icon]:hidden">Flashcard Maker</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1">
            <Avatar className="h-9 w-9">
                <AvatarFallback>UA</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold">UPSC Aspirant</p>
                <p className="truncate text-xs text-sidebar-foreground/70">Test User</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 group-data-[collapsible=icon]:hidden">
                <Icons.Settings className="size-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {activeView === 'dashboard' && <DashboardView setActiveView={setActiveView} />}
        {activeView === 'syllabus' && <SyllabusView />}
      </SidebarInset>
    </SidebarProvider>
  )
}
