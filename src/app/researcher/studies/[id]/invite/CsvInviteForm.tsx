"use client";

import { useActionState, useState } from "react";
import { importInvitesFromCsv } from "./actions";
import { parseCsv } from "@/lib/csv";

type ParsedRow = { email: string; full_name: string; valid: boolean };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CsvInviteForm({ studyId }: { studyId: string }) {
  const boundImport = importInvitesFromCsv.bind(null, studyId);
  const [state, formAction, pending] = useActionState(boundImport, {
    error: null,
    imported: null,
  });
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setParseError(null);

    const text = await file.text();
    const parsed = parseCsv(text);

    if (parsed.length === 0) {
      setRows([]);
      setParseError("That file looks empty.");
      return;
    }

    const header = parsed[0].map((h) => h.trim().toLowerCase());
    const emailIdx = header.indexOf("email");
    const nameIdx = header.indexOf("full_name");

    if (emailIdx === -1) {
      setRows([]);
      setParseError('The file needs an "email" column header.');
      return;
    }

    const seen = new Set<string>();
    const result = parsed
      .slice(1)
      .filter((r) => r.some((cell) => cell.trim() !== ""))
      .map((r) => {
        const email = (r[emailIdx] ?? "").trim();
        const fullName = nameIdx >= 0 ? (r[nameIdx] ?? "").trim() : "";
        const normalized = email.toLowerCase();
        const valid = EMAIL_PATTERN.test(email) && !seen.has(normalized);
        if (valid) seen.add(normalized);
        return { email, full_name: fullName, valid };
      });

    setRows(result);
  }

  const validRows = rows.filter((r) => r.valid);

  return (
    <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-zinc-700">
          Or import from a CSV file
        </p>
        <a
          href="/invite-template.csv"
          download
          className="text-sm text-zinc-500 underline"
        >
          Download sample template
        </a>
      </div>

      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
        className="mt-3 w-full text-sm text-zinc-700"
      />

      {parseError && <p className="mt-2 text-sm text-red-600">{parseError}</p>}

      {fileName && rows.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-zinc-600">
            {validRows.length} of {rows.length} row
            {rows.length === 1 ? "" : "s"} look valid.
          </p>
          <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-sm">
            {rows.map((row, i) => (
              <li
                key={i}
                className={`flex items-center justify-between gap-2 rounded px-2 py-1 ${
                  row.valid ? "text-zinc-700" : "bg-red-50 text-red-700"
                }`}
              >
                <span className="truncate">
                  {row.email || "(no email)"}
                  {row.full_name ? ` — ${row.full_name}` : ""}
                </span>
                {!row.valid && (
                  <span className="shrink-0 text-xs">skipped</span>
                )}
              </li>
            ))}
          </ul>

          <form action={formAction} className="mt-3">
            <input
              type="hidden"
              name="rows"
              value={JSON.stringify(
                validRows.map(({ email, full_name }) => ({ email, full_name })),
              )}
            />
            <button
              type="submit"
              disabled={pending || validRows.length === 0}
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
            >
              {pending
                ? "Importing..."
                : `Import ${validRows.length} invite${validRows.length === 1 ? "" : "s"}`}
            </button>
          </form>
        </div>
      )}

      {state.error && <p className="mt-3 text-sm text-red-600">{state.error}</p>}
      {state.imported !== null && (
        <p className="mt-3 text-sm text-emerald-700">
          Imported {state.imported} invite{state.imported === 1 ? "" : "s"}.
        </p>
      )}
    </div>
  );
}
