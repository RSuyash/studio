
'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SyllabusTopic, ResourceWithTopicInfo, ResourceCategory, ResourceStatus } from '@/lib/types';
import { findTopicById, findPathToTopicId, serializeSyllabusForPrompt } from '@/lib/resource-utils';
import { suggestSyllabusTopic } from '@/ai/flows/suggest-topic-flow';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';


const resourceCategories: ResourceCategory[] = ['book', 'video', 'pdf', 'note'];
const resourceStatuses: ResourceStatus[] = ['todo', 'in-progress', 'completed'];

const resourceSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  description: z.string().optional(),
  category: z.enum(resourceCategories),
  status: z.enum(resourceStatuses),
  topicId: z.string().min(1, { message: 'Please select a final syllabus topic.' }),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;

interface ResourceFormDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: ResourceFormValues) => void;
    resourceToEdit: ResourceWithTopicInfo | null;
    syllabusData: SyllabusTopic[];
}

export default function ResourceFormDialog({ 
    isOpen, 
    onOpenChange, 
    onSubmit,
    resourceToEdit,
    syllabusData
}: ResourceFormDialogProps) {
    const form = useForm<ResourceFormValues>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            title: '',
            url: '',
            description: '',
            category: 'book',
            status: 'todo',
            topicId: '',
        }
    });

    const [selectedPath, setSelectedPath] = React.useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = React.useState(false);
    const { toast } = useToast();
    const formId = React.useId();

    React.useEffect(() => {
        if (isOpen) {
            if (resourceToEdit) {
                form.reset({
                    title: resourceToEdit.title,
                    url: resourceToEdit.url,
                    description: resourceToEdit.description || '',
                    category: resourceToEdit.category,
                    topicId: resourceToEdit.topicId,
                    status: resourceToEdit.status,
                });
                const path = findPathToTopicId(syllabusData, resourceToEdit.topicId);
                setSelectedPath(path || []);
            } else {
                form.reset({
                    title: '',
                    url: '',
                    description: '',
                    category: 'book',
                    status: 'todo',
                    topicId: '',
                });
                setSelectedPath([]);
            }
        }
    }, [resourceToEdit, form, isOpen, syllabusData]);
    
    const handleSuggestTopic = async () => {
        const title = form.getValues('title');
        if (!title) {
            toast({
                variant: 'destructive',
                title: 'Title is required',
                description: 'Please enter a title before suggesting a topic.',
            });
            return;
        }

        setIsSuggesting(true);
        try {
            const syllabusTreeText = serializeSyllabusForPrompt(syllabusData);
            const result = await suggestSyllabusTopic({
                resourceTitle: title,
                resourceDescription: form.getValues('description'),
                syllabusTreeText,
            });
            
            const suggestedTopicId = result.topicId;
            const path = findPathToTopicId(syllabusData, suggestedTopicId);

            if (path) {
                setSelectedPath(path);
                const selectedTopic = findTopicById(syllabusData, suggestedTopicId);
                 if (selectedTopic && (!selectedTopic.subtopics || selectedTopic.subtopics.length === 0)) {
                    form.setValue('topicId', suggestedTopicId, { shouldValidate: true });
                } else {
                    form.setValue('topicId', '', { shouldValidate: true });
                }
                toast({
                    title: 'AI Suggestion Successful',
                    description: `The topic has been set to "${selectedTopic?.title}".`,
                });
            } else {
                throw new Error('AI returned an invalid topic ID.');
            }

        } catch (error) {
            console.error("AI topic suggestion failed:", error);
            toast({
                variant: "destructive",
                title: "AI Suggestion Failed",
                description: "Could not suggest a topic. Please select one manually.",
            });
        } finally {
            setIsSuggesting(false);
        }
    };


    const renderCascadingSelects = () => {
        const selects = [];
        let currentLevelTopics = syllabusData;

        for (let i = 0; i <= selectedPath.length; i++) {
            if (!currentLevelTopics || currentLevelTopics.length === 0) break;

            const currentIterationTopics = [...currentLevelTopics];
            const selectedValue = selectedPath[i] || "";

            selects.push(
                 <FormItem key={`level-${i}`}>
                    <FormLabel>{i === 0 ? 'Syllabus Topic' : 'Sub-topic'}</FormLabel>
                    <Select
                        value={selectedValue}
                        onValueChange={(value) => {
                            const newPath = [...selectedPath.slice(0, i), value];
                            setSelectedPath(newPath);

                            const selectedTopic = findTopicById(syllabusData, value);
                            if (selectedTopic && (!selectedTopic.subtopics || selectedTopic.subtopics.length === 0)) {
                                form.setValue('topicId', value, { shouldValidate: true });
                            } else {
                                form.setValue('topicId', '', { shouldValidate: true });
                            }
                        }}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={i === 0 ? 'Select a top-level topic...' : 'Select a sub-topic...'} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <ScrollArea className="h-60">
                                {currentIterationTopics.map(topic => (
                                    <SelectItem key={topic.id} value={topic.id}>
                                        {topic.title}
                                    </SelectItem>
                                ))}
                            </ScrollArea>
                        </SelectContent>
                    </Select>
                </FormItem>
            );

            if (selectedValue) {
                const nextParent = currentIterationTopics.find(t => t.id === selectedValue);
                currentLevelTopics = nextParent?.subtopics || [];
            } else {
                break;
            }
        }
        return selects;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px] max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle>{resourceToEdit ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
                    <DialogDescription>
                        {resourceToEdit ? 'Update the details of your resource.' : 'Fill in the details for your new resource.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-6">
                    <Form {...form}>
                        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 'Indian Polity by M. Laxmikanth'" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="A short note about this resource..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {resourceCategories.map((cat) => (
                                                        <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {resourceStatuses.map((status) => (
                                                        <SelectItem key={status} value={status} className="capitalize">{status.replace('-', ' ')}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="topicId"
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium">Syllabus Link</h4>
                                            <Button type="button" variant="outline" size="sm" onClick={handleSuggestTopic} disabled={isSuggesting}>
                                                <Sparkles className={cn("mr-2 h-4 w-4", isSuggesting && "animate-spin")} />
                                                {isSuggesting ? 'Thinking...' : 'Suggest Topic'}
                                            </Button>
                                        </div>
                                        {renderCascadingSelects()}
                                        <input type="hidden" {...field} />
                                        <FormMessage />
                                    </div>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter className="border-t p-6">
                    <Button type="submit" form={formId}>
                        {resourceToEdit ? 'Save Changes' : 'Add Resource'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
