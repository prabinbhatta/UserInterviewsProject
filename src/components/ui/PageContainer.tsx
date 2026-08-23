export function PageContainer({
  children,
  maxWidth = "max-w-xl",
}: {
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className={`w-full ${maxWidth}`}>{children}</div>
    </div>
  );
}
