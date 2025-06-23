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
import type { SyllabusTopic, ResourceWithTopicInfo } from '@/lib/types';
import { findTopicById, findPathToTopic, bookSubjects, bookSubjectTopicMap, topicIdToBookSubjectMap } from '@/lib/resource-utils';
import { categoryInfoMap } from './resource-card';

const resourceSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  description: z.string().optional(),
  category: z.enum(['book-ncert', 'book-reference', 'lecture-playlist', 'lecture-video']),
  topicId: z.string().min(1, { message: 'Please select a subject or a final syllabus topic.' }),
  class: z.string().optional(),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;

const ncertClasses = ['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

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
            category: 'book-reference',
            topicId: '',
            class: '',
        }
    });

    const [selectedPath, setSelectedPath] = React.useState<string[]>([]);
    const [selectedSubject, setSelectedSubject] = React.useState<string>('');
    const formId = React.useId();
    const watchedCategory = form.watch('category');
    const isBook = watchedCategory === 'book-ncert' || watchedCategory === 'book-reference';

    React.useEffect(() => {
        if (isOpen) {
            if (resourceToEdit) {
                form.reset({
                    title: resourceToEdit.title,
                    url: resourceToEdit.url,
                    description: resourceToEdit.description || '',
                    category: resourceToEdit.category,
                    topicId: resourceToEdit.topicId,
                    class: resourceToEdit.class || '',
                });
                 if (resourceToEdit.category === 'book-ncert' || resourceToEdit.category === 'book-reference') {
                    const subject = topicIdToBookSubjectMap[resourceToEdit.topicId];
                    setSelectedSubject(subject || '');
                } else {
                    const path = findPathToTopic(syllabusData, resourceToEdit.topicId);
                    setSelectedPath(path || []);
                }
            } else {
                form.reset({
                    title: '',
                    url: '',
                    description: '',
                    category: 'book-reference',
                    topicId: '',
                    class: '',
                });
                setSelectedPath([]);
                setSelectedSubject('');
            }
        }
    }, [resourceToEdit, form, isOpen, syllabusData]);

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
                                                {Object.entries(categoryInfoMap).map(([key, {title}]) => (
                                                    <SelectItem key={key} value={key}>{title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {watchedCategory === 'book-ncert' && (
                                <FormField
                                    control={form.control}
                                    name="class"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Class</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a class for the NCERT book" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {ncertClasses.map(c => (
                                                        <SelectItem key={c} value={c}>Class {c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="topicId"
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        {isBook ? (
                                            <FormItem>
                                                <FormLabel>Subject</FormLabel>
                                                <Select 
                                                    value={selectedSubject}
                                                    onValueChange={(subject) => {
                                                        setSelectedSubject(subject);
                                                        const topicId = bookSubjectTopicMap[subject];
                                                        field.onChange(topicId);
                                                    }}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a subject..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                         {bookSubjects.map(subject => (
                                                            <SelectItem key={subject} value={subject}>
                                                                {subject}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        ) : (
                                            renderCascadingSelects()
                                        )}
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
