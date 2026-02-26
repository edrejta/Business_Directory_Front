"use client";

import { useMemo, useState } from "react";
import type { OwnerBusiness, UpsertBusinessInput } from "@/lib/types/business";

type Props = {
  mode: "create" | "edit";
  initial?: Partial<OwnerBusiness>;
  onCancel: () => void;
  onSubmit: (input: UpsertBusinessInput) => Promise<void>;
};

export default function BusinessForm({ mode, initial, onCancel, onSubmit }: Props) {
  const [name, setName] = useState(initial?.businessName ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [phone, setPhone] = useState(initial?.phoneNumber ?? "");
  const [openDays, setOpenDays] = useState({
    mondayOpen: (initial as any)?.openDays?.mondayOpen ?? true,
    tuesdayOpen: (initial as any)?.openDays?.tuesdayOpen ?? true,
    wednesdayOpen: (initial as any)?.openDays?.wednesdayOpen ?? true,
    thursdayOpen: (initial as any)?.openDays?.thursdayOpen ?? true,
    fridayOpen: (initial as any)?.openDays?.fridayOpen ?? true,
    saturdayOpen: (initial as any)?.openDays?.saturdayOpen ?? false,
    sundayOpen: (initial as any)?.openDays?.sundayOpen ?? false,
  });
  const [touchedOpenDays, setTouchedOpenDays] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = useMemo(() => (mode === "create" ? "Shto biznes të ri" : "Ndrysho biznesin"), [mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Emri i biznesit është i detyrueshëm.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        businessName: name.trim(),
        description: description.trim() || undefined,
        address: address.trim() || undefined,
        city: city || undefined,
        phoneNumber: phone.trim() || undefined,
      };

      if (mode === "create" || touchedOpenDays || (initial as any)?.openDays !== undefined) {
        payload.openDays = openDays;
      }

      await onSubmit(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ndodhi një gabim.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      {mode === "edit" && (
        <div className="mb-3 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          Your changes will be submitted and require admin approval before going live.
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={onCancel}
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
          type="button"
        >
          Mbyll
        </button>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Emri *</span>
          <input
            className="rounded-lg border px-3 py-2 outline-none focus:ring"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="p.sh. Alba Coffee"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Përshkrimi</span>
          <textarea
            className="min-h-[90px] rounded-lg border px-3 py-2 outline-none focus:ring"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Shkruaj diçka për biznesin..."
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Adresa</span>
            <input
              className="rounded-lg border px-3 py-2 outline-none focus:ring"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rr. ..."
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Qyteti</span>
            <select
              className="rounded-lg border px-3 py-2 outline-none focus:ring"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Zgjidh qytetin</option>
              <option value="Prishtinë">Prishtinë</option>
              <option value="Prizren">Prizren</option>
              <option value="Pejë">Pejë</option>
              <option value="Gjakovë">Gjakovë</option>
              <option value="Ferizaj">Ferizaj</option>
              <option value="Gjilan">Gjilan</option>
              <option value="Mitrovicë">Mitrovicë</option>
              <option value="Suharekë">Suharekë</option>
              <option value="Vushtrri">Vushtrri</option>
              <option value="Rahovec">Rahovec</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Telefoni</span>
            <input
              className="rounded-lg border px-3 py-2 outline-none focus:ring"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+383..."
            />
          </label>
        </div>

        <fieldset className="mt-3">
          <legend className="text-sm font-medium">Open Days</legend>
          <div className="grid gap-2 md:grid-cols-3 mt-2">
            {[
              ["mondayOpen", "Monday"],
              ["tuesdayOpen", "Tuesday"],
              ["wednesdayOpen", "Wednesday"],
              ["thursdayOpen", "Thursday"],
              ["fridayOpen", "Friday"],
              ["saturdayOpen", "Saturday"],
              ["sundayOpen", "Sunday"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(openDays as any)[key]}
                  onChange={(e) => {
                    setTouchedOpenDays(true);
                    setOpenDays((prev) => ({ ...prev, [(key as string)]: e.target.checked }));
                  }}
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-2 flex gap-2">
          <button
            disabled={isSubmitting}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            type="submit"
          >
            {isSubmitting ? "Duke ruajtur..." : mode === "create" ? "Krijo" : "Ruaj ndryshimet"}
          </button>

          <button onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50" type="button">
            Anulo
          </button>
        </div>
      </form>
    </div>
  );
}
