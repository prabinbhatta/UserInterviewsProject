"use client";

import { useActionState, useState } from "react";
import { importInvitesFromCsv } from "./actions";
import { parseCsv } from "@/lib/csv";
import { useLanguage } from "@/app/LanguageProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mutedLinkClasses } from "@/components/ui/link";

type ParsedRow = { email: string; full_name: string; valid: boolean };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CsvInviteForm({ studyId }: { studyId: string }) {
  const { t } = useLanguage();
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
      setParseError(t("csvEmptyFileError"));
      return;
    }

    const header = parsed[0].map((h) => h.trim().toLowerCase());
    const emailIdx = header.indexOf("email");
    const nameIdx = header.indexOf("full_name");

    if (emailIdx === -1) {
      setRows([]);
      setParseError(t("csvMissingEmailColumnError"));
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
    <Card className="mt-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-[var(--ink)]/80">
          {t("orImportCsvLabel")}
        </p>
        <a
          href="/invite-template.csv"
          download
          className={`text-sm ${mutedLinkClasses}`}
        >
          {t("downloadSampleTemplateLink")}
        </a>
      </div>

      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
        className="mt-3 w-full text-sm text-[var(--ink)]/80"
      />

      {parseError && <p className="mt-2 text-sm text-[#a8371c]">{parseError}</p>}

      {fileName && rows.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-[var(--ink)]/60">
            {t("csvValidRowsLabel")}: {validRows.length}/{rows.length}
          </p>
          <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-sm">
            {rows.map((row, i) => (
              <li
                key={i}
                className={`flex items-center justify-between gap-2 rounded px-2 py-1 ${
                  row.valid ? "text-[var(--ink)]/80" : "bg-[var(--danger)]/10 text-[#a8371c]"
                }`}
              >
                <span className="truncate">
                  {row.email || t("noEmailPlaceholder")}
                  {row.full_name ? ` — ${row.full_name}` : ""}
                </span>
                {!row.valid && (
                  <span className="shrink-0 text-xs">{t("skippedLabel")}</span>
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
            <Button type="submit" disabled={pending || validRows.length === 0} size="sm">
              {pending
                ? t("importingGeneric")
                : `${t("importInvitesAction")} (${validRows.length})`}
            </Button>
          </form>
        </div>
      )}

      {state.error && <p className="mt-3 text-sm text-[#a8371c]">{state.error}</p>}
      {state.imported !== null && (
        <p className="mt-3 text-sm text-emerald-700">
          {t("importedLabel")}: {state.imported}
        </p>
      )}
    </Card>
  );
}
