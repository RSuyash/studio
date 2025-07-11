import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    Icon: LucideIcon;
    title: string;
    value: number | string;
    description: string;
}

export default function StatCard({ Icon, title, value, description }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
