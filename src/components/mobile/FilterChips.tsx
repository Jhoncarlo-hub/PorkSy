interface Chip {
  id: string;
  label: string;
  emoji?: string;
}

interface FilterChipsProps {
  chips: Chip[];
  active: string;
  onChange: (id: string) => void;
}

export function FilterChips({ chips, active, onChange }: FilterChipsProps) {
  return (
    <div className="agri-filter-chips">
      {chips.map(({ id, label, emoji }) => (
        <button
          key={id}
          className={`agri-chip${active === id ? ' active' : ''}`}
          onClick={() => onChange(id)}
        >
          {emoji && <span>{emoji}</span>}
          {label}
        </button>
      ))}
    </div>
  );
}
