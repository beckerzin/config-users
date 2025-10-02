interface DateInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function DateInput({ id, value, onChange, disabled = false, className = '' }: DateInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      id={id}
      type="date"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={`flex h-12 w-full max-w-xs rounded-md border border-input bg-input-background px-3 py-2 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${className}`}
      style={{
        fontSize: '16px', // Evita zoom automático no iOS
        minHeight: '48px', // Altura mínima para touch targets no iOS
        WebkitAppearance: 'none',
        appearance: 'none'
      }}
      autoComplete="off"
      data-testid={`date-input-${id}`}
    />
  );
}