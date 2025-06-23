import * as React from 'react';
import { LoaderCircle, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { SyllabusTopic } from '@/lib/types';
import { explainSyllabusTopic } from '@/ai/flows/explain-topic-flow';
import { Separator } from '@/components/ui/separator';

interface FocusModeDialogProps {
  topic: SyllabusTopic | null;
  isOpen: boolean;
  onClose: () => void;
}

const masteryTextMap: Record<SyllabusTopic['mastery'], string> = {
  none: 'Not Started',
  novice: 'Novice',
  advanced: 'Advanced',
  expert: 'Expert',
};

export default function FocusModeDialog({ topic, isOpen, onClose }: FocusModeDialogProps) {
  const [explanation, setExplanation] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    // Reset AI state when topic changes or dialog opens
    if (isOpen) {
      setExplanation('');
      setIsGenerating(false);
    }
  }, [isOpen, topic]);

  if (!topic) return null;
  
  const handleExplain = async () => {
    setIsGenerating(true);
    setExplanation('');
    try {
      const result = await explainSyllabusTopic({
        title: topic.title,
        description: topic.description,
      });
      if (result.explanation) {
        setExplanation(result.explanation);
      } else {
        throw new Error('Failed to get an explanation.');
      }
    } catch (error) {
      console.error("Failed to explain topic:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not generate an explanation for this topic. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{topic.title}</DialogTitle>
          <DialogDescription className="pt-2">
            {topic.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Mastery Level</h4>
              <p>{masteryTextMap[topic.mastery]}</p>
            </div>
             <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Tags</h4>
              <div className="flex flex-wrap gap-2 pt-2">
                {topic.tags.length > 0 ? (
                  topic.tags.map((tag) => <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>)
                ) : (
                  <p className="text-sm text-muted-foreground">No tags.</p>
                )}
              </div>
            </div>

            {(isGenerating || explanation) && <Separator />}
            
            {isGenerating && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span>Generating explanation...</span>
              </div>
            )}
            
            {explanation && (
                <div className="space-y-2">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI Explanation
                    </h4>
                    <p className="text-sm leading-relaxed">{explanation}</p>
                </div>
            )}
        </div>
        <DialogFooter className="border-t pt-4">
          <Button
            onClick={handleExplain}
            disabled={isGenerating}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Explain with AI
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
