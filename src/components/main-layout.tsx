
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
  SidebarSeparator,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Icons } from '@/components/icons'
import type { SyllabusTopic, ExamComparisonData, Resource, Exam, SavedStudyPlan } from '@/lib/types';
import SyllabusViewer from '@/components/syllabus/syllabus-viewer'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ResourcesView from '@/components/resources/resources-view';
import ExamExplorerView from './exam-explorer/exam-explorer-view';
import MpscExplorerView from './exam-explorer/mpsc-explorer-view';
import IfosExplorerView from './exam-explorer/ifos-explorer-view';
import { DashboardView } from './dashboard/dashboard-view';
import ExamCentreView from './exam-centre/exam-centre-view';
import InsightsView from './insights/insights-view';
import StudyPlannerView from './planner/study-planner-view';
import MyPlansView from './planner/my-plans-view';
import { LogOut } from 'lucide-react';

export type View = 'dashboard' | 'syllabus' | 'resources' | 'exam-explorer' | 'exam-centre' | 'insights' | 'mpsc-explorer' | 'ifos-explorer' | 'study-planner' | 'my-plans';
export type SyllabusType = 'upsc' | 'mpsc' | 'ifos';

interface MainLayoutProps {
  comparisonData: ExamComparisonData[];
  upscSyllabusData: SyllabusTopic[];
  mpscSyllabusData: SyllabusTopic[];
  ifosSyllabusData: SyllabusTopic[];
  resourceData: Record<string, Resource[]>;
  upscExamData: Exam;
  mpscExamData: Exam;
  ifosExamData: Exam;
  savedPlansData: SavedStudyPlan[];
}

export default function MainLayout({ 
  comparisonData,
  upscSyllabusData: initialUpscData,
  mpscSyllabusData: initialMpscData,
  ifosSyllabusData: initialIfosData,
  resourceData: initialResourceData,
  upscExamData,
  mpscExamData,
  ifosExamData,
  savedPlansData,
}: MainLayoutProps) {
  const [activeView, setActiveView] = React.useState<View>('dashboard');
  const [activeSyllabus, setActiveSyllabus] = React.useState<SyllabusType>('upsc');
  const [selectedTopicId, setSelectedTopicId] = React.useState<string | null>(null);

  const [upscData, setUpscData] = React.useState(initialUpscData);
  const [mpscData, setMpscData] = React.useState(initialMpscData);
  const [ifosData, setIfosData] = React.useState(initialIfosData);
  const [resourceData, setResourceData] = React.useState<Record<string, Resource[]>>(initialResourceData);

  const menuItems = [
    { view: 'dashboard', label: 'Dashboard', icon: Icons.LayoutDashboard },
    { view: 'exam-centre', label: 'Exam Centre', icon: Icons.Layers },
    { view: 'syllabus', label: 'Syllabus Explorer', icon: Icons.BookOpen, syllabus: 'upsc' },
    { view: 'study-planner', label: 'Study Planner', icon: Icons.ListTodo },
    { view: 'my-plans', label: 'My Plans', icon: Icons.ListChecks },
    { view: 'insights', label: 'Exam Insights', icon: Icons.Sparkles },
    { view: 'resources', label: 'My Resources', icon: Icons.Library },
  ];
  
  const handleViewChange = (view: View, syllabus?: SyllabusType, topicId?: string) => {
    setActiveView(view);
    if (syllabus) {
        setActiveSyllabus(syllabus);
    }
    if (topicId) {
        setSelectedTopicId(topicId);
    } else {
        setSelectedTopicId(null);
    }
  };

  const renderActiveView = () => {
    const allSyllabusData = { upsc: upscData, mpsc: mpscData, ifos: ifosData };

    switch (activeView) {
        case 'dashboard':
            return <DashboardView setActiveView={handleViewChange} />;
        case 'exam-explorer':
            return <ExamExplorerView setActiveView={handleViewChange} exam={upscExamData} />;
        case 'mpsc-explorer':
            return <MpscExplorerView setActiveView={handleViewChange} exam={mpscExamData} />;
        case 'ifos-explorer':
            return <IfosExplorerView setActiveView={handleViewChange} exam={ifosExamData} />;
        case 'insights':
            return <InsightsView 
                      upscExam={upscExamData}
                      upscSyllabus={upscData}
                      mpscExam={mpscExamData}
                      mpscSyllabus={mpscData}
                      ifosExam={ifosExamData}
                      ifosSyllabus={ifosData}
                   />;
        case 'exam-centre':
            return <ExamCentreView setActiveView={handleViewChange} comparisonData={comparisonData} />;
        case 'study-planner':
            return <StudyPlannerView 
                        allSyllabusData={allSyllabusData}
                        setActiveView={handleViewChange} 
                    />;
        case 'my-plans':
            return <MyPlansView savedPlans={savedPlansData} setActiveView={handleViewChange} />;
        case 'syllabus': {
            const dataMap = { upsc: upscData, mpsc: mpscData, ifos: ifosData };
            const setDataMap = { upsc: setUpscData, mpsc: setMpscData, ifos: setIfosData };

            return <SyllabusViewer 
                syllabusData={dataMap[activeSyllabus]} 
                setSyllabusData={setDataMap[activeSyllabus]} 
                activeSyllabus={activeSyllabus} 
                setActiveSyllabus={setActiveSyllabus}
                resourceData={resourceData}
                setResourceData={setResourceData}
                selectedTopicId={selectedTopicId}
                onSelectTopic={setSelectedTopicId}
            />;
        }
        case 'resources':
             return <ResourcesView 
                resourceData={resourceData}
                setResourceData={setResourceData}
                allSyllabusData={allSyllabusData}
             />;
        default:
            return <DashboardView setActiveView={handleViewChange} />;
    }
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex w-full items-center justify-between p-2">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Icons.Logo className="size-5" />
                    </div>
                    <h1 className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">Nexus Cortex</h1>
                </div>
                <SidebarTrigger className="hidden group-data-[collapsible=icon]:flex" />
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.view}>
                <SidebarMenuButton
                  isActive={activeView === item.view}
                  onClick={() => handleViewChange(item.view as View, item.syllabus as SyllabusType | undefined)}
                  className="w-full"
                  tooltip={item.label}
                >
                  <item.icon className="size-4" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1.5">
            <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="profile avatar" />
                <AvatarFallback>UA</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold text-sidebar-foreground">UPSC Aspirant</p>
                <p className="truncate text-xs text-sidebar-foreground/70">aspirant@nexus.com</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent group-data-[collapsible=icon]:hidden">
                <LogOut className="size-4" />
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
