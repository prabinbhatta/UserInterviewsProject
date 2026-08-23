"use client";

import { useActionState, useState } from "react";
import { updateParticipantProfile } from "./actions";
import { DISTRICTS } from "@/lib/districts";

const INCOME_BANDS = [
  "Below NPR 20,000",
  "NPR 20,000–40,000",
  "NPR 40,000–60,000",
  "NPR 60,000–100,000",
  "Above NPR 100,000",
  "Prefer not to say",
];

const LANGUAGES = ["Nepali", "English", "Other"];
const DEVICES = ["Computer with webcam", "Tablet", "Smartphone"];

type DefaultValues = {
  district: string | null;
  age: number | null;
  occupation: string | null;
  income_band: string | null;
  languages: string[];
  devices: string[];
};

export function ProfileForm({ defaultValues }: { defaultValues: DefaultValues }) {
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
      <label className="block text-sm font-medium text-zinc-700">
        District
        <select
          name="district"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        >
          <option value="">Select a district</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      {district === "Other" && (
        <label className="mt-4 block text-sm font-medium text-zinc-700">
          Enter your district or municipality
          <input
            type="text"
            name="district_other"
            defaultValue={isKnownDistrict ? "" : initialDistrict}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
          />
        </label>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-zinc-700">
          Age
          <input
            type="number"
            name="age"
            min={1}
            max={120}
            defaultValue={defaultValues.age ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
          />
        </label>

        <label className="block text-sm font-medium text-zinc-700">
          Occupation
          <input
            type="text"
            name="occupation"
            defaultValue={defaultValues.occupation ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
          />
        </label>
      </div>

      <label className="mt-4 block text-sm font-medium text-zinc-700">
        Monthly household income
        <select
          name="income_band"
          defaultValue={defaultValues.income_band ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none"
        >
          <option value="">Prefer not to answer</option>
          {INCOME_BANDS.map((band) => (
            <option key={band} value={band}>
              {band}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4">
        <p className="text-sm font-medium text-zinc-700">Languages you speak</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {LANGUAGES.map((lang) => (
            <label
              key={lang}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
            >
              <input
                type="checkbox"
                name="languages"
                value={lang}
                defaultChecked={defaultValues.languages.includes(lang)}
                className="h-4 w-4"
              />
              {lang}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-zinc-700">
          Devices available to you
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          {DEVICES.map((device) => (
            <label
              key={device}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
            >
              <input
                type="checkbox"
                name="devices"
                value={device}
                defaultChecked={defaultValues.devices.includes(device)}
                className="h-4 w-4"
              />
              {device}
            </label>
          ))}
        </div>
      </div>

      {state.error && <p className="mt-4 text-sm text-red-600">{state.error}</p>}
      {state.saved && !state.error && (
        <p className="mt-4 text-sm text-emerald-700">Profile saved.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
