import { clsx } from "clsx";

type ButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wide transition-all duration-200 cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        {
          "bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0 active:shadow-md":
            variant === "primary",
          "bg-accent text-white shadow-lg shadow-accent/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 active:translate-y-0 active:shadow-md":
            variant === "secondary",
          "border-2 border-primary-lighter bg-surface text-foreground hover:border-primary hover:bg-primary hover:text-white active:bg-primary-light":
            variant === "outline",
          "text-muted hover:bg-border-light hover:text-foreground active:bg-border":
            variant === "ghost",
          "bg-danger text-white shadow-lg shadow-danger/20 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0":
            variant === "danger",
        },
        {
          "h-9 px-4 text-xs": size === "sm",
          "h-12 px-6 text-sm": size === "md",
          "h-14 px-8 text-base": size === "lg",
        },
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
