"use client";

import { useRef, useState, useTransition } from "react";
import { updateParticipantProfile, type ProfileFormState } from "./actions";
import { DISTRICTS } from "@/lib/districts";
import { useLanguage } from "@/app/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { fieldClasses, labelClasses } from "@/components/ui/field";

const INCOME_BANDS: { value: string; labelKey: TranslationKey }[] = [
  { value: "Below NPR 20,000", labelKey: "incomeBand1" },
  { value: "NPR 20,000–40,000", labelKey: "incomeBand2" },
  { value: "NPR 40,000–60,000", labelKey: "incomeBand3" },
  { value: "NPR 60,000–100,000", labelKey: "incomeBand4" },
  { value: "Above NPR 100,000", labelKey: "incomeBand5" },
  { value: "Prefer not to say", labelKey: "incomeBand6" },
];

const LANGUAGES: { value: string; labelKey: TranslationKey }[] = [
  { value: "Nepali", labelKey: "languageNepali" },
  { value: "English", labelKey: "languageEnglish" },
  { value: "Other", labelKey: "languageOther" },
];
const DEVICES: { value: string; labelKey: TranslationKey }[] = [
  { value: "Computer with webcam", labelKey: "deviceComputerWebcam" },
  { value: "Tablet", labelKey: "deviceTablet" },
  { value: "Smartphone", labelKey: "deviceSmartphone" },
];

type DefaultValues = {
  district: string | null;
  age: number | null;
  occupation: string | null;
  income_band: string | null;
  languages: string[];
  devices: string[];
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function deriveFields(values: DefaultValues) {
  const initialDistrict = values.district ?? "";
  const isKnownDistrict = DISTRICTS.includes(initialDistrict);
  return {
    district: isKnownDistrict ? initialDistrict : initialDistrict ? "Other" : "",
    districtOther: isKnownDistrict ? "" : initialDistrict,
    age: values.age?.toString() ?? "",
    occupation: values.occupation ?? "",
    incomeBand: values.income_band ?? "",
    languages: values.languages,
    devices: values.devices,
  };
}

export function ProfileForm({ defaultValues }: { defaultValues: DefaultValues }) {
  const { t } = useLanguage();
  const [state, setState] = useState<ProfileFormState>({ error: null });
  const [pending, startTransition] = useTransition();

  // Every field here is controlled, and submission goes through a plain
  // onSubmit handler rather than <form action={fn}> — React 19 resets a
  // <form action={fn}> back to its DOM-attribute defaults after a
  // successful submission, and that reset can land after React's own
  // controlled re-render, silently reverting fields even though the save
  // itself succeeded. preventDefault() + calling the action ourselves
  // sidesteps that native form lifecycle entirely.
  const [fields, setFields] = useState(() => deriveFields(defaultValues));
  const { district, districtOther, age, occupation, incomeBand, languages, devices } = fields;
  const setDistrict = (v: string) => setFields((f) => ({ ...f, district: v }));
  const setDistrictOther = (v: string) => setFields((f) => ({ ...f, districtOther: v }));
  const setAge = (v: string) => setFields((f) => ({ ...f, age: v }));
  const setOccupation = (v: string) => setFields((f) => ({ ...f, occupation: v }));
  const setIncomeBand = (v: string) => setFields((f) => ({ ...f, incomeBand: v }));
  const setLanguages = (updater: (prev: string[]) => string[]) =>
    setFields((f) => ({ ...f, languages: updater(f.languages) }));
  const setDevices = (updater: (prev: string[]) => string[]) =>
    setFields((f) => ({ ...f, devices: updater(f.devices) }));

  const noticeRef = useRef<HTMLDivElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateParticipantProfile(state, formData);
      setState(result);
      if (result.saved && result.values) {
        setFields(deriveFields(result.values));
      }
      requestAnimationFrame(() => {
        noticeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-xl">
      <label className={labelClasses}>
        {t("filterDistrict")}
        <select
          name="district"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className={fieldClasses}
        >
          <option value="">{t("selectADistrict")}</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      {district === "Other" && (
        <label className={`mt-4 ${labelClasses}`}>
          {t("enterDistrictOtherLabel")}
          <input
            type="text"
            name="district_other"
            value={districtOther}
            onChange={(e) => setDistrictOther(e.target.value)}
            className={fieldClasses}
          />
        </label>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <label className={labelClasses}>
          {t("ageFieldLabel")}
          <input
            type="number"
            name="age"
            min={1}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className={labelClasses}>
          {t("occupationFieldLabel")}
          <input
            type="text"
            name="occupation"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className={fieldClasses}
          />
        </label>
      </div>

      <label className={`mt-4 ${labelClasses}`}>
        {t("monthlyIncomeFieldLabel")}
        <select
          name="income_band"
          value={incomeBand}
          onChange={(e) => setIncomeBand(e.target.value)}
          className={fieldClasses}
        >
          <option value="">{t("selectAnOption")}</option>
          {INCOME_BANDS.map((band) => (
            <option key={band.value} value={band.value}>
              {t(band.labelKey)}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4">
        <p className={labelClasses}>{t("languagesSpokenLabel")}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {LANGUAGES.map((lang) => (
            <label
              key={lang.value}
              className="flex items-center gap-2 rounded-lg border border-[var(--mist)] px-3 py-2 text-sm text-[var(--ink)]/80"
            >
              <input
                type="checkbox"
                name="languages"
                value={lang.value}
                checked={languages.includes(lang.value)}
                onChange={() => setLanguages((prev) => toggle(prev, lang.value))}
                className="h-4 w-4 accent-[var(--indigo)]"
              />
              {t(lang.labelKey)}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className={labelClasses}>{t("devicesAvailableLabel")}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {DEVICES.map((device) => (
            <label
              key={device.value}
              className="flex items-center gap-2 rounded-lg border border-[var(--mist)] px-3 py-2 text-sm text-[var(--ink)]/80"
            >
              <input
                type="checkbox"
                name="devices"
                value={device.value}
                checked={devices.includes(device.value)}
                onChange={() => setDevices((prev) => toggle(prev, device.value))}
                className="h-4 w-4 accent-[var(--indigo)]"
              />
              {t(device.labelKey)}
            </label>
          ))}
        </div>
      </div>

      <div ref={noticeRef}>
        {state.error && (
          <Notice tone="danger" className="mt-4">
            {state.error}
          </Notice>
        )}
        {state.saved && !state.error && (
          <Notice tone="success" className="mt-4">
            {t("profileSavedMessage")}
          </Notice>
        )}
      </div>

      <Button type="submit" disabled={pending} className="mt-6 w-full">
        {pending ? t("savingGeneric") : t("saveProfileAction")}
      </Button>
    </form>
  );
}
