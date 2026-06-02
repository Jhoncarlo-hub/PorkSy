import * as Icons from 'lucide-react';
import type { ComponentType } from 'react';

export function AppIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = (Icons as unknown as Record<string, ComponentType<{ size?: number; strokeWidth?: number }>>)[name] ?? Icons.Circle;
  return <Icon size={size} strokeWidth={1.8} />;
}
