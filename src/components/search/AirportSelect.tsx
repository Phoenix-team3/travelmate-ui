import { MapPin } from "lucide-react";
import { airports } from "../../data/airports";

interface Props {
  id: string;
  testId: string;
  name: string;
  label: string;
  value: string;
  onChange: (code: string) => void;
  excludeCode?: string;
}

export default function AirportSelect({ id, testId, name, label, value, onChange, excludeCode }: Props) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-500">
        {label}
      </label>
      <div className="relative">
        <MapPin
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <select
          id={id}
          name={name}
          data-testid={testId}
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3.5 pl-9 pr-3 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          {airports
            .filter((a) => a.code !== excludeCode)
            .map((airport) => (
              <option key={airport.code} value={airport.code}>
                {airport.city} ({airport.code})
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
