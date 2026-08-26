type CardProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

export function Card<T extends React.ElementType = "div">({
  as,
  className = "",
  ...props
}: CardProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={`rounded-2xl border border-[var(--mist)] bg-white p-5 shadow-[0_1px_3px_rgba(18,23,43,0.05)] ${className}`}
      {...props}
    />
  );
}
