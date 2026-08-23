export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-[var(--mist)] bg-white p-5 ${className}`}
      {...props}
    />
  );
}
