import type { Region } from '../../data/places';
import { REGIONS } from '../../data/places';

interface RegionFilterProps {
  active: Region | 'All';
  onChange: (r: Region | 'All') => void;
  counts: Record<string, number>;
}

export default function RegionFilter({ active, onChange, counts }: RegionFilterProps) {
  const options: (Region | 'All')[] = ['All', ...REGIONS];
  return (
    <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Filter places by region">
      {options.map((opt) => {
        const isActive = active === opt;
        return (
          <button
            key={opt}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-gold text-night-900 shadow-md shadow-gold/30'
                : 'border border-sand-500/25 bg-night-800/60 text-sand-200 hover:border-gold/50 hover:text-gold'
            }`}
          >
            {opt}
            <span className={`ml-1.5 text-xs ${isActive ? 'text-night-900/60' : 'text-sand-400/50'}`}>
              {counts[opt] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
