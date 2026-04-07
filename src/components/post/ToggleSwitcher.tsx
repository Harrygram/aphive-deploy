'use client';

import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle';

export default function ToggleSwitcher({
  onChange,
}: {
  onChange: (val: 'joined' | 'all') => void;
}) {
  const [view, setView] = useState<'joined' | 'all'>('joined');

  const handleChange = (val: string) => {
    if (val === 'joined' || val === 'all') {
      setView(val);
      onChange(val);
    }
  };

  return (
    <ToggleGroup type="single" value={view} onValueChange={handleChange}>
      <ToggleGroupItem value="joined">Joined</ToggleGroupItem>
      <ToggleGroupItem value="all">All</ToggleGroupItem>
    </ToggleGroup>
  );
}
