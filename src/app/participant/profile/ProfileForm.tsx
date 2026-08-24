"use client";

import { useActionState, useState } from "react";
import { updateParticipantProfile } from "./actions";
import { DISTRICTS } from "@/lib/districts";
import { useLanguage } from "@/app/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
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

export function ProfileForm({ defaultValues }: { defaultValues: DefaultValues }) {
  const { t } = useLanguage();
  const [state, formAction, pending] = useActionState(updateParticipantProfile, {
    error: null,
  });

  const initialDistrict = defaultValues.district ?? "";
  const isKnownDistrict = DISTRICTS.includes(initialDistrict);
  const [district, setDistrict] = useState(
    isKnownDistrict ? initialDistrict : initialDistrict ? "Other" : "",
  );

  return (
    <form action={formAction} className="w-full max-w-xl">
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
            defaultValue={isKnownDistrict ? "" : initialDistrict}
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
            defaultValue={defaultValues.age ?? ""}
            className={fieldClasses}
          />
        </label>

        <label className={labelClasses}>
          {t("occupationFieldLabel")}
          <input
            type="text"
            name="occupation"
            defaultValue={defaultValues.occupation ?? ""}
            className={fieldClasses}
          />
        </label>
      </div>

      <label className={`mt-4 ${labelClasses}`}>
        {t("monthlyIncomeFieldLabel")}
        <select
          name="income_band"
          defaultValue={defaultValues.income_band ?? ""}
          className={fieldClasses}
        >
          <option value="">{t("preferNotToAnswer")}</option>
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
                defaultChecked={defaultValues.languages.includes(lang.value)}
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
                defaultChecked={defaultValues.devices.includes(device.value)}
                className="h-4 w-4 accent-[var(--indigo)]"
              />
              {t(device.labelKey)}
            </label>
          ))}
        </div>
      </div>

      {state.error && <p className="mt-4 text-sm text-[#a8371c]">{state.error}</p>}
      {state.saved && !state.error && (
        <p className="mt-4 text-sm text-emerald-700">{t("profileSavedMessage")}</p>
      )}

      <Button type="submit" disabled={pending} className="mt-6 w-full">
        {pending ? t("savingGeneric") : t("saveProfileAction")}
      </Button>
    </form>
  );
}
