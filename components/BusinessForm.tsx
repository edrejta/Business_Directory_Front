"use client";

import { useMemo, useState } from "react";
import type { Business, CreateBusinessInput } from "@/lib/types/business";
import { KOSOVO_CITIES } from "@/lib/constants/kosovoCities";

type Props = {
  mode: "create" | "edit";
  initial?: Business;
  onSubmit: (data: CreateBusinessInput) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

const BUSINESS_TYPES = ["Unknown", "Cafe", "Restaurant", "Hotel", "Gym", "Salon", "Shop", "Service"] as const;

const EMPTY_FORM: CreateBusinessInput = {
  name: "",
  type: "Unknown",
  city: "",
  address: "",
  businessUrl: "",
  description: "",
  phoneNumber: "",
  imageUrl: "",
  businessNumber: "",
};

function toMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string") return err;
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string" && m) return m;
  }
  return "Something went wrong.";
}

export default function BusinessForm({ mode, initial, onSubmit, onCancel, isSubmitting }: Props) {
  const [form, setForm] = useState<CreateBusinessInput>(() => {
    if (!initial) return { ...EMPTY_FORM };

    return {
      name: initial.name ?? "",
      type: (initial.type ?? "Unknown") as CreateBusinessInput["type"],
      city: initial.city ?? "",
      address: initial.address ?? "",
      businessUrl: initial.businessUrl ?? "",
      description: initial.description ?? "",
      phoneNumber: initial.phoneNumber ?? "",
      imageUrl: initial.imageUrl ?? "",
      businessNumber: initial.businessNumber ?? "",
    };
  });

  const [error, setError] = useState<string | null>(null);

  const canEditBusinessNumber = mode === "create";

  const canSubmit = useMemo(() => {
    if (isSubmitting) return false;
    if (!form.name.trim()) return false;
    if (!form.city.trim()) return false;
    if (!String(form.type ?? "").trim()) return false;
    if (!form.businessNumber.trim()) return false;
    return true;
  }, [form, isSubmitting]);

  function update<K extends keyof CreateBusinessInput>(key: K, value: CreateBusinessInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        type: String(form.type).trim() as CreateBusinessInput["type"],
        city: form.city.trim(),
        address: form.address?.trim() || undefined,
        businessUrl: form.businessUrl?.trim() || undefined,
        description: form.description?.trim() || undefined,
        phoneNumber: form.phoneNumber?.trim() || undefined,
        imageUrl: form.imageUrl?.trim() || undefined,
        businessNumber: form.businessNumber.trim(),
      });
    } catch (err: unknown) {
      setError(toMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Business name *</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Cafe Uno"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Type *</label>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={String(form.type)}
            onChange={(e) => update("type", e.target.value as CreateBusinessInput["type"])}
            required
          >
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">City *</label>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            required
          >
            <option value="">Zgjidh qytetin</option>
            {KOSOVO_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Address</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={form.address ?? ""}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Street / area"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Business number *</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={form.businessNumber}
            onChange={(e) => update("businessNumber", e.target.value)}
            placeholder="e.g. 83273298"
            required
            disabled={!canEditBusinessNumber}
          />
          {!canEditBusinessNumber ? (
            <p className="text-xs text-gray-500">Business number cannot be changed after creation.</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Phone number</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={form.phoneNumber ?? ""}
            onChange={(e) => update("phoneNumber", e.target.value)}
            placeholder="+383 ..."
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">Business website (URL)</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={form.businessUrl ?? ""}
            onChange={(e) => update("businessUrl", e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">Logo image URL</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={form.imageUrl ?? ""}
            onChange={(e) => update("imageUrl", e.target.value)}
            placeholder="https://.../logo.png"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="w-full rounded-md border px-3 py-2"
            value={form.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <button type="button" className="rounded-md border px-4 py-2" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        ) : null}

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={isSubmitting || !canSubmit}
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create business" : "Save changes"}
        </button>
      </div>
    </form>
  );
}