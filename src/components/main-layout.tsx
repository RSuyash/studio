"use client"

import * as React from 'react'

import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { Icons } from '@/components/icons'
import SyllabusViewer from '@/components/syllabus/syllabus-viewer'
import { Separator } from '@/components/ui/separator'

export default function MainLayout() {
  const [syllabusData, setSyllabusData] = React.useState(null);

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
          {/* FilterPanel will be rendered within SyllabusViewer and passed here */}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Syllabus Overview</h2>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <SyllabusViewer />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
