import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '../ui/button';

const analysisItems = [
    {
        title: 'PYQ Analysis',
        description: 'Topic-wise breakdown of Previous Year Questions to understand patterns and priority areas.',
    },
    {
        title: 'Topic Weightage',
        description: 'Analysis of subject and topic importance over the years based on marks distribution.',
    },
    {
        title: 'Cut-off Trends',
        description: 'Historical data on Prelims and Mains cut-off marks to set realistic targets.',
    },
];

export default function AnalysisSection({ examTitle }: { examTitle: string }) {
    return (
        <div>
            <h2 className="mb-4 mt-8 text-2xl font-headline font-bold">Trends &amp; Analysis</h2>
            <p className="text-muted-foreground mb-6">
                Explore data-driven insights into the {examTitle} exam. More features are coming soon.
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {analysisItems.map((item) => (
                    <Card key={item.title} className="flex flex-col bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground">{item.title}</CardTitle>
                            <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow" />
                        <CardFooter>
                            <Button className="w-full" disabled>Coming Soon</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
