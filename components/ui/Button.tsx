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
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        {
          "bg-primary text-white hover:bg-primary-dark active:bg-primary-dark":
            variant === "primary",
          "bg-accent text-white hover:bg-accent-dark active:bg-accent-dark":
            variant === "secondary",
          "border-2 border-border bg-white text-foreground hover:bg-border-light active:bg-border":
            variant === "outline",
          "text-foreground hover:bg-border-light active:bg-border":
            variant === "ghost",
          "bg-danger text-white hover:bg-red-600 active:bg-red-700":
            variant === "danger",
        },
        {
          "h-9 px-3 text-sm": size === "sm",
          "h-11 px-5 text-sm": size === "md",
          "h-13 px-7 text-base": size === "lg",
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
