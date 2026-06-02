import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
  label?: string;
}

export function FAB({ onClick, label = 'Add new' }: FABProps) {
  return (
    <button className="mobile-fab" onClick={onClick} aria-label={label}>
      <Plus size={26} />
    </button>
  );
}
