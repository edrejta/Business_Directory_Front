"use client";

import { useMemo, useState } from "react";
import type { Business, CreateBusinessInput, UpdateBusinessInput } from "@/lib/types/business";

type Props =
  | {
      mode: "create";
      onSubmit: (dto: CreateBusinessInput) => Promise<void> | void;
      onCancel: () => void;
    }
  | {
      mode: "edit";
      initial: Business;
      onSubmit: (dto: UpdateBusinessInput) => Promise<void> | void;
      onCancel: () => void;
    };

export default function BusinessForm(props: Props) {
  const isEdit = props.mode === "edit";

  const initial = useMemo(() => {
    if (!isEdit) {
      return {
        BusinessName: "",
        Address: "",
        City: "",
        Email: "",
        PhoneNumber: "",
        Description: "",
      };
    }

    return {
      BusinessName: props.initial.BusinessName ?? "",
      Address: props.initial.Address ?? "",
      City: props.initial.City ?? "",
      Email: props.initial.Email ?? "",
      PhoneNumber: props.initial.PhoneNumber ?? "",
      Description: props.initial.Description ?? "",
    };
  }, [isEdit, props]);

  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patch<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.BusinessName.trim()) return setError("Business name është i detyrueshëm.");
    if (!form.Address.trim()) return setError("Adresa është e detyrueshme.");
    if (!form.City.trim()) return setError("Qyteti është i detyrueshëm.");
    if (!form.Email.trim()) return setError("Email është i detyrueshëm.");
    if (!form.PhoneNumber.trim()) return setError("Numri i telefonit është i detyrueshëm.");

    setSubmitting(true);
    try {
      const payload: CreateBusinessInput = {
        BusinessName: form.BusinessName.trim(),
        Address: form.Address.trim(),
        City: form.City.trim(),
        Email: form.Email.trim(),
        PhoneNumber: form.PhoneNumber.trim(),
        Description: form.Description.trim(),

        BusinessType: 0,
        ImageUrl: "",
      };

      await props.onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ndodhi një gabim.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{props.mode === "create" ? "Shto biznes" : "Edit biznes"}</h2>

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="mt-4 grid gap-3">
        <div>
          <label className="text-sm font-medium">Business Name</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={form.BusinessName}
            onChange={(e) => patch("BusinessName", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Address</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={form.Address}
            onChange={(e) => patch("Address", e.target.value)}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">City</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              value={form.City}
              onChange={(e) => patch("City", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              value={form.PhoneNumber}
              onChange={(e) => patch("PhoneNumber", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={form.Email}
            onChange={(e) => patch("Email", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            rows={4}
            value={form.Description}
            onChange={(e) => patch("Description", e.target.value)}
          />
        </div>

        <div className="mt-2 flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Duke ruajtur..." : props.mode === "create" ? "Krijo" : "Ruaj ndryshimet"}
          </button>

          <button
            type="button"
            onClick={props.onCancel}
            disabled={submitting}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            Anulo
          </button>
        </div>
      </form>
    </section>
  );
}