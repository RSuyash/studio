import * as React from 'react';
import { Filter } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterPanelProps {
  allTags: string[];
  selectedTags: Set<string>;
  onTagToggle: (tag: string) => void;
}

export default function FilterPanel({ allTags, selectedTags, onTagToggle }: FilterPanelProps) {
  return (
    <div className="p-2">
      <h3 className="mb-4 flex items-center gap-2 px-2 text-sm font-semibold text-sidebar-foreground/70">
        <Filter className="h-4 w-4" />
        Filter by Tags
      </h3>
      <div className="space-y-2 px-2">
        {allTags.map((tag) => (
          <div key={tag} className="flex items-center space-x-2">
            <Checkbox
              id={`tag-${tag}`}
              checked={selectedTags.has(tag)}
              onCheckedChange={() => onTagToggle(tag)}
            />
            <Label
              htmlFor={`tag-${tag}`}
              className="cursor-pointer text-sm font-normal capitalize"
            >
              {tag}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
