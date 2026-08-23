import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 font-sans">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
          Nepal User Research
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600">
          Connecting Nepali companies who need user research with
          participants ready to take part.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup?role=researcher"
            className="flex h-12 w-56 items-center justify-center rounded-full bg-zinc-900 px-5 text-base font-medium text-white transition-colors hover:bg-zinc-700"
          >
            I need research done
          </Link>
          <Link
            href="/signup?role=participant"
            className="flex h-12 w-56 items-center justify-center rounded-full border border-zinc-300 px-5 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            I want to join studies
          </Link>
        </div>
        <Link href="/login" className="text-sm text-zinc-500 underline">
          Already have an account? Log in
        </Link>
      </main>
    </div>
  );
}
