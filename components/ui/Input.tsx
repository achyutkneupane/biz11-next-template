import { clsx } from "clsx";

type InputProps = {
  label?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Input({
  label,
  error,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          "h-11 rounded-lg border-2 px-4 text-sm text-foreground placeholder:text-muted-light",
          "transition-colors duration-200",
          "focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary",
          error ? "border-danger" : "border-border hover:border-primary-light",
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
