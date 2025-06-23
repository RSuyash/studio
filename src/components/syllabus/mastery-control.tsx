import * as React from 'react';
import { BrainCircuit, Check, ChevronsUpDown } from 'lucide-react';
import type { MasteryLevel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface MasteryControlProps {
  currentLevel: MasteryLevel;
  onLevelChange: (level: MasteryLevel) => void;
}

const masteryLevels: { level: MasteryLevel; label: string; color: string }[] = [
  { level: 'none', label: 'Not Started', color: 'text-muted-foreground' },
  { level: 'novice', label: 'Novice', color: 'text-yellow-500' },
  { level: 'advanced', label: 'Advanced', color: 'text-blue-500' },
  { level: 'expert', label: 'Expert', color: 'text-green-500' },
];

export default function MasteryControl({ currentLevel, onLevelChange }: MasteryControlProps) {
  const currentMastery = masteryLevels.find(m => m.level === currentLevel);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 justify-start">
          <BrainCircuit className={cn("mr-2 h-4 w-4", currentMastery?.color)} />
          <span className="truncate">{currentMastery?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {masteryLevels.map(({ level, label, color }) => (
          <DropdownMenuItem key={level} onSelect={() => onLevelChange(level)}>
            <BrainCircuit className={cn("mr-2 h-4 w-4", color)} />
            <span>{label}</span>
            {currentLevel === level && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
