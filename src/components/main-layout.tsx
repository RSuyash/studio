"use client"

import * as React from 'react'

import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarTrigger, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { Icons } from '@/components/icons'
import SyllabusViewer from '@/components/syllabus/syllabus-viewer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type View = 'dashboard' | 'syllabus';

const DashboardView = () => {
    return (
        <>
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
                <SidebarTrigger className="md:hidden" />
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">Dashboard</h2>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-6">
                <div className="mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome to Nexus Cortex!</CardTitle>
                            <CardDescription>This is your personal learning dashboard. Use the sidebar to navigate to different tools.</CardDescription>
                        </CardHeader>
                    </Card>
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
                                +20.1% from last month
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
                </div>
            </main>
        </>
    )
}

const SyllabusView = () => {
    return (
        <>
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
                <SidebarTrigger className="md:hidden" />
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
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icons.Logo className="size-5" />
            </div>
            <h1 className="font-headline text-xl font-bold text-primary">Nexus Cortex</h1>
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
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {/* Portal target for sidebar content from other components */}
          <div id="sidebar-content-portal" />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'syllabus' && <SyllabusView />}
      </SidebarInset>
    </SidebarProvider>
  )
}
