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
  const [phone, setPhone] = useState(initial?.phoneNumber ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = useMemo(
    () => (mode === "create" ? "Shto biznes të ri" : "Ndrysho biznesin"),
    [mode]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Emri i biznesit është i detyrueshëm.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        businessName: name.trim(),
        description: description.trim() || undefined,
        address: address.trim() || undefined,
        phoneNumber: phone.trim() || undefined,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ndodhi një gabim.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
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
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
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
            <span className="text-sm font-medium">Telefoni</span>
            <input
              className="rounded-lg border px-3 py-2 outline-none focus:ring"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+383..."
            />
          </label>
        </div>

        <div className="mt-2 flex gap-2">
          <button
            disabled={isSubmitting}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            type="submit"
          >
            {isSubmitting ? "Duke ruajtur..." : mode === "create" ? "Krijo" : "Ruaj ndryshimet"}
          </button>

          <button
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            type="button"
          >
            Anulo
          </button>
        </div>
      </form>
    </div>
  );
}