'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

interface SavePlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
}

export default function SavePlanDialog({ isOpen, onOpenChange, onSave }: SavePlanDialogProps) {
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
        // Pre-fill with a default name when dialog opens
        setName(`Study Plan - ${format(new Date(), "yyyy-MM-dd")}`);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Study Plan</DialogTitle>
          <DialogDescription>
            Give your new study plan a name to save it for later.
          </DialogDescription>
        </DialogHeader>
        <form id="save-plan-form" onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-name" className="text-right">
                Name
                </Label>
                <Input
                id="plan-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
                />
            </div>
            </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="save-plan-form">Save Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
