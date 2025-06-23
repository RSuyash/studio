
"use client"

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from "@/components/ui/button"
import { Skeleton } from '@/components/ui/skeleton'
import type { View, SyllabusType } from '../main-layout';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Target, PencilLine, CalendarDays, ArrowRight, BookUser, History } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const PerformanceChart = dynamic(
  () => import('@/components/dashboard/subject-mastery-chart'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />
  }
)

const recentActivities = [
  { icon: Target, text: "You mastered 'Indian Parliament Structure'", time: "2 hours ago" },
  { icon: PencilLine, text: "You completed a mock test on 'Modern History'", time: "5 hours ago" },
  { icon: BookUser, text: "You added a new resource for 'GS-IV Ethics'", time: "1 day ago" },
  { icon: Target, text: "You set 'Novice' for 'Post-Independence Consolidation'", time: "2 days ago" },
]

const topResources = [
    { title: "Indian Polity", author: "M. Laxmikanth", subject: "Polity" },
    { title: "Ancient and Medieval India", author: "Poonam Dalal Dahiya", subject: "History" },
    { title: "Indian Economy", author: "Sanjiv Verma", subject: "Economy" },
]

const recentCourses = [
    { title: "GS Paper II: Full Course", progress: 75, category: "Polity & Governance" },
    { title: "Ethics, Integrity and Aptitude", progress: 45, category: "GS Paper IV" },
    { title: "World History: Mains", progress: 60, category: "History" },
]

export const DashboardView = ({ setActiveView }: { setActiveView: (view: View, syllabus?: SyllabusType) => void }) => {

    return (
        <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, Aspirant!</h1>
                    <p className="text-muted-foreground">Here's a snapshot of your progress. Keep up the great work!</p>
                </div>
                 <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search topics, resources..." className="pl-9" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Syllabus Covered</CardTitle>
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">75%</div>
                        <p className="text-xs text-muted-foreground">+5% from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Topics Mastered</CardTitle>
                        <Target className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42</div>
                        <p className="text-xs text-muted-foreground">2 expert, 15 advanced</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mock Tests Taken</CardTitle>
                        <PencilLine className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Days to Prelims 2025</CardTitle>
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">245</div>
                        <p className="text-xs text-muted-foreground">Stay focused and consistent</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Performance Over Time</CardTitle>
                        <CardDescription>Mock test scores from the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <PerformanceChart />
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <Card>
                         <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity, index) => {
                                    const Icon = activity.icon;
                                    return (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="bg-muted rounded-full p-2">
                                                <Icon className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{activity.text}</p>
                                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Top Resources</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {topResources.map((resource, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 rounded-md">
                                             <AvatarImage src={`https://placehold.co/100x100.png?text=${resource.subject.charAt(0)}`} alt={resource.subject} data-ai-hint="book cover" />
                                            <AvatarFallback>{resource.subject.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm">{resource.title}</p>
                                            <p className="text-xs text-muted-foreground">{resource.author}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Recent Courses</CardTitle>
                    <CardDescription>Continue where you left off.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Progress</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentCourses.map((course) => (
                                <TableRow key={course.title}>
                                    <TableCell className="font-medium">{course.title}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{course.category}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{course.progress}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    )
}
