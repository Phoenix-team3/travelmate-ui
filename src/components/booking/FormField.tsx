interface Props {
  id: string;
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  testId: string;
  maxLength?: number;
}

export default function FormField({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  testId,
  maxLength,
}: Props) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        data-testid={testId}
        aria-label={label}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-xl border px-3.5 py-3 text-sm text-slate-800 shadow-sm transition focus:outline-none focus:ring-2 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200 focus:border-brand-500 focus:ring-brand-100"
        }`}
      />
      {error && (
        <p id={errorId} data-testid={`${testId}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
