"use client"

import * as React from 'react'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Icons } from '@/components/icons'
import { initialSyllabusData, type SyllabusTopic } from "@/lib/syllabus-data";
import SyllabusViewer from '@/components/syllabus/syllabus-viewer'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ResourcesView from '@/components/resources/resources-view';
import ExamExplorerView from './exam-explorer/exam-explorer-view';
import MpscExplorerView from './exam-explorer/mpsc-explorer-view';
import { DashboardView } from './dashboard/dashboard-view';
import ExamCentreView from './exam-centre/exam-centre-view';
import InsightsView from './insights/insights-view';
import type { ExamComparisonData } from '@/lib/exam-comparison-data';

export type View = 'dashboard' | 'syllabus' | 'resources' | 'exam-explorer' | 'exam-centre' | 'insights' | 'mpsc-explorer';

interface MainLayoutProps {
  comparisonData: ExamComparisonData[];
  comparisonDataError: string | null;
}

export default function MainLayout({ comparisonData, comparisonDataError }: MainLayoutProps) {
  const [activeView, setActiveView] = React.useState<View>('dashboard');
  const [syllabusData, setSyllabusData] = React.useState(initialSyllabusData);

  const menuItems = [
    { view: 'dashboard', label: 'Dashboard', icon: Icons.LayoutDashboard },
    { view: 'exam-centre', label: 'Exam Centre', icon: Icons.Layers },
    { view: 'syllabus', label: 'Syllabus Explorer', icon: Icons.BookOpen },
    { view: 'resources', label: 'My Resources', icon: Icons.Library },
  ];

  const renderActiveView = () => {
    switch (activeView) {
        case 'dashboard':
            return <DashboardView setActiveView={setActiveView} />;
        case 'exam-explorer':
            return <ExamExplorerView setActiveView={setActiveView} />;
        case 'mpsc-explorer':
            return <MpscExplorerView setActiveView={setActiveView} />;
        case 'insights':
            return <InsightsView setActiveView={setActiveView} />;
        case 'exam-centre':
            return <ExamCentreView setActiveView={setActiveView} comparisonData={comparisonData} comparisonDataError={comparisonDataError} />;
        case 'syllabus':
            return <SyllabusViewer syllabusData={syllabusData} setSyllabusData={setSyllabusData} />;
        case 'resources':
            return <ResourcesView syllabusData={syllabusData} setSyllabusData={setSyllabusData} />;
        default:
            return <DashboardView setActiveView={setActiveView} />;
    }
  }

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
        {renderActiveView()}
      </SidebarInset>
    </SidebarProvider>
  )
}
