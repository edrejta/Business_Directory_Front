"use client";

import { Suspense, useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import type { Business, CreateBusinessInput, UpdateBusinessInput } from "@/lib/types/business";
import { getMyBusinesses, createBusiness, updateBusiness, deleteBusiness } from "@/lib/api/businesses";
import { createBusinessSchema, updateBusinessSchema, normalizeUrl } from "@/lib/validation/business";
import { API_URL } from "@/lib/api/config";
import { getToken } from "@/lib/auth/storage";
import {
  createPromotion,
  deletePromotion,
  getMyPromotions,
  updatePromotion,
  type Promotion,
  type PromotionCategory,
} from "@/lib/api/promotions";

type DealForm = {
  title: string;
  description: string;
  category: PromotionCategory;
  originalPrice: string;
  discountedPrice: string;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
};

type OpenDaysForm = {
  mondayOpen: boolean;
  tuesdayOpen: boolean;
  wednesdayOpen: boolean;
  thursdayOpen: boolean;
  fridayOpen: boolean;
  saturdayOpen: boolean;
  sundayOpen: boolean;
};

type BusinessFormState = {
  name: string;
  city: string;
  type: string;
  description: string;
  address: string;
  businessNumber: string;
  businessUrl: string;
  phoneNumber: string;
  email: string;
  imageUrl: string;
};

type BusinessView = { mode: "list" } | { mode: "create" } | { mode: "edit"; business: Business };

const KOSOVO_CITIES = [
  "Decan",
  "Dragash",
  "Drenas",
  "Ferizaj",
  "Fushe Kosove",
  "Gjakova",
  "Gjilan",
  "Gracanice",
  "Hani i Elezit",
  "Istog",
  "Junik",
  "Kacanik",
  "Kamenica",
  "Kline",
  "Kllokot",
  "Leposaviq",
  "Lipjan",
  "Malisheva",
  "Mamusha",
  "Mitrovica (Jugut)",
  "Mitrovica (Veriut)",
  "Novo Brdo",
  "Obiliq",
  "Partesh",
  "Peja",
  "Podujeva",
  "Prishtina",
  "Prizren",
  "Rahovec",
  "Ranillugu",
  "Skenderaj",
  "Shtime",
  "Shterpce",
  "Suhareka",
  "Viti",
  "Vushtrri",
  "Zubin Potok",
  "Zvecan",
] as const;

enum BusinessTypeEnum {
  Unknown = "Unknown",
  Cafe = "Cafe",
  Restaurant = "Restaurant",
  Hotel = "Hotel",
  Gym = "Gym",
  Salon = "Salon",
  Shop = "Shop",
  Service = "Service",
}

const CITIES = [...KOSOVO_CITIES];
const BUSINESS_TYPES = Object.values(BusinessTypeEnum);

const initialDealForm: DealForm = {
  title: "",
  description: "",
  category: "Discounts",
  originalPrice: "",
  discountedPrice: "",
  startsAt: "",
  expiresAt: "",
  isActive: true,
};

const initialBusinessForm: BusinessFormState = {
  name: "",
  city: "",
  type: BusinessTypeEnum.Unknown,
  description: "",
  address: "",
  businessNumber: "",
  businessUrl: "",
  phoneNumber: "",
  email: "",
  imageUrl: "",
};

const defaultOpenDays: OpenDaysForm = {
  mondayOpen: true,
  tuesdayOpen: true,
  wednesdayOpen: true,
  thursdayOpen: true,
  fridayOpen: true,
  saturdayOpen: false,
  sundayOpen: false,
};

async function readJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function toDatetimeLocal(value: string | null | undefined) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function normalizeRoleValue(value: string) {
  return value.replace(/[\s_-]+/g, "").trim().toLowerCase();
}

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4;
    if (pad) b64 += "=".repeat(4 - pad);
    const json = atob(b64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getAllRolesFromUserOrToken(user: any): string[] {
  const roles: string[] = [];

  const add = (v: unknown) => {
    if (!v) return;
    if (Array.isArray(v)) {
      for (const x of v) add(x);
      return;
    }
    if (typeof v === "string") {
      const s = v.trim();
      if (s) roles.push(s);
      return;
    }
  };

  add(user?.role);
  add(user?.roles);

  const token = getToken();
  if (token) {
    const payload = decodeJwtPayload(token);
    if (payload) {
      add(payload.role);
      add(payload.roles);
      add(payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
      add(payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"]);
    }
  }

  return roles;
}

function DashboardBusinessInner() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [bizLoading, setBizLoading] = useState(false);
  const [bizError, setBizError] = useState<string | null>(null);
  const [bizMessage, setBizMessage] = useState<string | null>(null);
  const [bizView, setBizView] = useState<BusinessView>({ mode: "list" });
  const [bizSubmitting, setBizSubmitting] = useState(false);
  const [bizForm, setBizForm] = useState<BusinessFormState>(initialBusinessForm);
  const [bizFieldErrors, setBizFieldErrors] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Business | null>(null);

  const [selectedOpenDaysBusinessId, setSelectedOpenDaysBusinessId] = useState<string>("");
  const [selectedDealBusinessId, setSelectedDealBusinessId] = useState<string>("");

  const [dealForm, setDealForm] = useState<DealForm>(initialDealForm);
  const [dealMessage, setDealMessage] = useState<string | null>(null);
  const [dealError, setDealError] = useState<string | null>(null);
  const [dealSubmitting, setDealSubmitting] = useState(false);

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(false);
  const [promotionsError, setPromotionsError] = useState<string | null>(null);
  const [editingPromotionId, setEditingPromotionId] = useState<string | null>(null);
  const [promotionDeleteId, setPromotionDeleteId] = useState<string | null>(null);

  const [promoConfirmOpen, setPromoConfirmOpen] = useState(false);
  const [pendingPromoDelete, setPendingPromoDelete] = useState<Promotion | null>(null);

  const [openDays, setOpenDays] = useState<OpenDaysForm>(defaultOpenDays);
  const [openDaysLoading, setOpenDaysLoading] = useState(false);
  const [openDaysMessage, setOpenDaysMessage] = useState<string | null>(null);

  const isEditBusiness = bizView.mode === "edit";
  const activeBusiness = bizView.mode === "edit" ? bizView.business : null;

  const bizSchema = useMemo(() => (isEditBusiness ? updateBusinessSchema : createBusinessSchema), [isEditBusiness]);

  const isBusinessOwner = useMemo(() => {
    const roles = getAllRolesFromUserOrToken(user);
    const normalized = roles.map(normalizeRoleValue);
    return normalized.includes("businessowner");
  }, [user]);

  useEffect(() => {
    if (isLoading) return;
    if (!user || !getToken()) router.replace("/login?next=/dashboard-business?mode=create");
  }, [isLoading, router, user]);

  useEffect(() => {
    if (isLoading) return;
    if (!user || !getToken()) return;
    const mode = searchParams.get("mode");
    if (mode === "create") startCreateBusiness();
  }, [isLoading, user, searchParams]);

  useEffect(() => {
    const loadMyBusinesses = async () => {
      if (!getToken()) return;

      setBizLoading(true);
      setBizError(null);

      try {
        const items = await getMyBusinesses();
        setBusinesses(items);

        if (items.length > 0) {
          setSelectedOpenDaysBusinessId((prev) => (prev ? prev : items[0].id));
          setSelectedDealBusinessId((prev) => (prev ? prev : items[0].id));
          setOpenDaysMessage(null);
          setDealError(null);
        } else {
          setSelectedOpenDaysBusinessId("");
          setSelectedDealBusinessId("");
          setOpenDays(defaultOpenDays);
          setOpenDaysMessage("Krijo një biznes që të vendosësh ditët e hapura.");
        }
      } catch (e: unknown) {
        setBizError(e instanceof Error ? e.message : "Nuk u arrit të ngarkohen bizneset.");
      } finally {
        setBizLoading(false);
      }
    };

    void loadMyBusinesses();
  }, [user]);

  useEffect(() => {
    const loadPromotions = async () => {
      if (!isBusinessOwner) return;
      if (!getToken()) return;
      if (!selectedDealBusinessId) {
        setPromotions([]);
        return;
      }

      setPromotionsLoading(true);
      setPromotionsError(null);

      try {
        const items = await getMyPromotions(selectedDealBusinessId);
        setPromotions(items);
      } catch (e) {
        setPromotionsError(e instanceof Error ? e.message : "Nuk u arrit të ngarkohen deal-et.");
      } finally {
        setPromotionsLoading(false);
      }
    };

    void loadPromotions();
  }, [selectedDealBusinessId, isBusinessOwner]);

  useEffect(() => {
    const loadOpenDays = async () => {
      if (!isBusinessOwner) return;
      if (!getToken()) return;
      if (!selectedOpenDaysBusinessId) return;

      setOpenDaysLoading(true);
      setOpenDaysMessage(null);

      try {
        const url = `${API_URL}/api/owner/opendays?businessId=${encodeURIComponent(selectedOpenDaysBusinessId)}`;
        const response = await fetch(url, { headers: { ...authHeaders() } });

        if (!response.ok) {
          const body = await readJsonSafe(response);
          const msg =
            (typeof body === "object" && body && "message" in body && typeof (body as any).message === "string"
              ? (body as any).message
              : response.statusText) || "Nuk u arrit të ngarkohen ditët e hapura.";
          setOpenDaysMessage(`Nuk u arrit të ngarkohen ditët e hapura (${response.status}) - ${msg}`);
          return;
        }

        const payload = (await response.json()) as OpenDaysForm;
        setOpenDays({
          mondayOpen: !!payload.mondayOpen,
          tuesdayOpen: !!payload.tuesdayOpen,
          wednesdayOpen: !!payload.wednesdayOpen,
          thursdayOpen: !!payload.thursdayOpen,
          fridayOpen: !!payload.fridayOpen,
          saturdayOpen: !!payload.saturdayOpen,
          sundayOpen: !!payload.sundayOpen,
        });
      } catch (e) {
        setOpenDaysMessage(e instanceof Error ? e.message : "Nuk u arrit të ngarkohen ditët e hapura.");
      } finally {
        setOpenDaysLoading(false);
      }
    };

    void loadOpenDays();
  }, [selectedOpenDaysBusinessId, isBusinessOwner]);

  const resetDealForm = () => {
    setDealForm(initialDealForm);
    setEditingPromotionId(null);
    setDealMessage(null);
    setDealError(null);
  };

  const refreshPromotions = async () => {
    if (!isBusinessOwner) return;
    if (!getToken()) return;
    if (!selectedDealBusinessId) return;

    setPromotionsLoading(true);
    setPromotionsError(null);

    try {
      const items = await getMyPromotions(selectedDealBusinessId);
      setPromotions(items);
    } catch (e) {
      setPromotionsError(e instanceof Error ? e.message : "Nuk u arrit të ngarkohen deal-et.");
    } finally {
      setPromotionsLoading(false);
    }
  };

  const onSaveOpenDays = async (e: FormEvent) => {
    e.preventDefault();
    if (!isBusinessOwner) return;
    if (!getToken()) return;

    if (!selectedOpenDaysBusinessId) {
      setOpenDaysMessage("Zgjidh një biznes para se t’i ruash ditët e hapura.");
      return;
    }

    setOpenDaysMessage(null);
    setOpenDaysLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/owner/opendays`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          businessId: selectedOpenDaysBusinessId,
          ...openDays,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) throw new Error(payload.message ?? `Nuk u arrit të ruhen ditët e hapura (${response.status}).`);

      setOpenDaysMessage("Ditët e hapura u ruajtën me sukses.");
    } catch (err) {
      setOpenDaysMessage(err instanceof Error ? err.message : "Ndodhi një gabim.");
    } finally {
      setOpenDaysLoading(false);
    }
  };

  const onSubmitDeal = async (e: FormEvent) => {
    e.preventDefault();
    if (!isBusinessOwner) return;
    if (!getToken()) return;

    if (!selectedDealBusinessId) {
      setDealError("Zgjidh një biznes para se të krijosh një deal.");
      return;
    }

    setDealError(null);
    setDealMessage(null);
    setDealSubmitting(true);

    try {
      const payload = {
        businessId: selectedDealBusinessId,
        title: dealForm.title,
        description: dealForm.description,
        category: dealForm.category,
        originalPrice: dealForm.originalPrice ? Number(dealForm.originalPrice) : null,
        discountedPrice: dealForm.discountedPrice ? Number(dealForm.discountedPrice) : null,
        startsAt: dealForm.startsAt ? new Date(dealForm.startsAt).toISOString() : null,
        expiresAt: dealForm.expiresAt ? new Date(dealForm.expiresAt).toISOString() : null,
        isActive: dealForm.isActive,
      };

      if (editingPromotionId) {
        await updatePromotion(editingPromotionId, payload);
        setDealMessage("Deal u përditësua me sukses.");
      } else {
        await createPromotion(payload);
        setDealMessage("Deal u krijua me sukses.");
      }

      await refreshPromotions();
      resetDealForm();
    } catch (err) {
      setDealError(err instanceof Error ? err.message : "Ndodhi një gabim.");
    } finally {
      setDealSubmitting(false);
    }
  };

  const onEditPromotion = (p: Promotion) => {
    setEditingPromotionId(p.id);
    setDealMessage(null);
    setDealError(null);
    setDealForm({
      title: p.title ?? "",
      description: p.description ?? "",
      category: (p.category as PromotionCategory) ?? "Discounts",
      originalPrice: p.originalPrice == null ? "" : String(p.originalPrice),
      discountedPrice: p.discountedPrice == null ? "" : String(p.discountedPrice),
      startsAt: toDatetimeLocal(p.startsAt),
      expiresAt: toDatetimeLocal(p.expiresAt),
      isActive: p.isActive ?? true,
    });
  };

  const onDeletePromotion = async (promotionId: string) => {
    if (!isBusinessOwner) return;
    if (!getToken()) return;
    if (!selectedDealBusinessId) return;

    setPromotionDeleteId(promotionId);
    setDealMessage(null);
    setDealError(null);

    try {
      await deletePromotion(promotionId);
      await refreshPromotions();
      if (editingPromotionId === promotionId) resetDealForm();
    } catch (e) {
      setDealError(e instanceof Error ? e.message : "Nuk u arrit të fshihet deal-i.");
    } finally {
      setPromotionDeleteId(null);
    }
  };

  function cancelPromoDelete() {
    if (promotionDeleteId) return;
    setPromoConfirmOpen(false);
    setPendingPromoDelete(null);
  }

  async function confirmPromoDelete() {
    if (!pendingPromoDelete) return;
    setPromoConfirmOpen(false);
    const id = pendingPromoDelete.id;
    setPendingPromoDelete(null);
    await onDeletePromotion(id);
  }

  function startCreateBusiness() {
    setBizMessage(null);
    setBizError(null);
    setBizFieldErrors({});
    setBizForm(initialBusinessForm);
    setBizView({ mode: "create" });
  }

  function startEditBusiness(b: Business) {
    setBizMessage(null);
    setBizError(null);
    setBizFieldErrors({});
    setBizForm({
      name: b.name ?? "",
      city: b.city ?? "",
      type: b.type ?? BusinessTypeEnum.Unknown,
      description: b.description ?? "",
      address: b.address ?? "",
      businessNumber: b.businessNumber ?? "",
      businessUrl: b.businessUrl ?? "",
      phoneNumber: b.phoneNumber ?? "",
      email: b.email ?? "",
      imageUrl: b.imageUrl ?? "",
    });
    setBizView({ mode: "edit", business: b });
  }

  function cancelBusinessForm() {
    setBizFieldErrors({});
    setBizMessage(null);
    setBizError(null);
    setBizView({ mode: "list" });
    setBizForm(initialBusinessForm);
  }

  async function submitBusinessForm(e: FormEvent) {
    e.preventDefault();
    if (!getToken()) return;

    setBizSubmitting(true);
    setBizMessage(null);
    setBizError(null);
    setBizFieldErrors({});

    const normalizedUrl = normalizeUrl(bizForm.businessUrl);
    const toValidate = { ...bizForm, businessUrl: normalizedUrl };
    const result = bizSchema.safeParse(toValidate);

    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0];
        if (typeof k === "string") errs[k] = issue.message;
      }
      setBizFieldErrors(errs);
      setBizSubmitting(false);
      return;
    }

    try {
      if (isEditBusiness && activeBusiness) {
        const input: UpdateBusinessInput = {
          name: bizForm.name.trim(),
          city: bizForm.city.trim(),
          type: bizForm.type.trim(),
          description: bizForm.description.trim() || undefined,
          address: bizForm.address.trim() || undefined,
          businessUrl: normalizedUrl || undefined,
          businessNumber: bizForm.businessNumber.trim(),
          phoneNumber: bizForm.phoneNumber.trim() || undefined,
          email: bizForm.email.trim() || undefined,
          imageUrl: bizForm.imageUrl.trim() || undefined,
        };

        const updated = await updateBusiness(activeBusiness.id, input);
        setBusinesses((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        setBizMessage("Biznesi u përditësua me sukses.");
        setBizView({ mode: "list" });
      } else {
        const input: CreateBusinessInput = {
          name: bizForm.name.trim(),
          city: bizForm.city.trim(),
          type: bizForm.type.trim(),
          description: bizForm.description.trim() || undefined,
          address: bizForm.address.trim() || undefined,
          businessNumber: bizForm.businessNumber.trim(),
          businessUrl: normalizedUrl || undefined,
          phoneNumber: bizForm.phoneNumber.trim() || undefined,
          email: bizForm.email.trim() || undefined,
          imageUrl: bizForm.imageUrl.trim() || undefined,
        };

        const created = await createBusiness(input);
        setBusinesses((prev) => [created, ...prev]);
        setSelectedOpenDaysBusinessId((prev) => (prev ? prev : created.id));
        setSelectedDealBusinessId((prev) => (prev ? prev : created.id));
        setBizMessage("Biznesi u dërgua me sukses.");
        setBizView({ mode: "list" });
      }

      setBizForm(initialBusinessForm);
    } catch (e: unknown) {
      setBizError(e instanceof Error ? e.message : "Nuk u arrit të dërgohet biznesi.");
    } finally {
      setBizSubmitting(false);
    }
  }

  function requestDelete(b: Business) {
    setPendingDelete(b);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;

    setConfirmOpen(false);

    const id = pendingDelete.id;
    const name = pendingDelete.name;
    setPendingDelete(null);

    setDeletingId(id);
    setBizMessage(null);
    setBizError(null);

    try {
      await deleteBusiness(id);
      setBusinesses((prev) => prev.filter((x) => x.id !== id));
      setBizMessage(`Biznesi "${name}" u fshi me sukses.`);

      setSelectedOpenDaysBusinessId((prev) => {
        if (prev !== id) return prev;
        const remaining = businesses.filter((x) => x.id !== id);
        return remaining.length > 0 ? remaining[0].id : "";
      });

      setSelectedDealBusinessId((prev) => {
        if (prev !== id) return prev;
        const remaining = businesses.filter((x) => x.id !== id);
        return remaining.length > 0 ? remaining[0].id : "";
      });
    } catch (e: unknown) {
      setBizError(e instanceof Error ? e.message : "Nuk u arrit të fshihet biznesi.");
    } finally {
      setDeletingId(null);
    }
  }

  function cancelDelete() {
    if (deletingId) return;
    setConfirmOpen(false);
    setPendingDelete(null);
  }

  if (isLoading || !user) return null;

  const openDaysBusinessName = businesses.find((b) => b.id === selectedOpenDaysBusinessId)?.name ?? "—";
  const dealBusinessName = businesses.find((b) => b.id === selectedDealBusinessId)?.name ?? "—";

  const openDayLabels: Array<[keyof OpenDaysForm, string]> = [
    ["mondayOpen", "E Hënë"],
    ["tuesdayOpen", "E Martë"],
    ["wednesdayOpen", "E Mërkurë"],
    ["thursdayOpen", "E Enjte"],
    ["fridayOpen", "E Premte"],
    ["saturdayOpen", "E Shtunë"],
    ["sundayOpen", "E Diel"],
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl space-y-8 sm:space-y-10">
          {isBusinessOwner ? (
            <>
              <section className="rounded-2xl border border-oak/35 bg-paper/95 p-5 shadow-panel sm:p-8">
                <h1 className="text-2xl font-bold text-espresso sm:text-3xl">Deals & Promotions</h1>
                <p className="mt-2 text-espresso/80">
                  Zgjedh kategorine ne dropdown dhe deal paraqitet automatikisht te /discounts, /flash-sales ose
                  /early-access.
                </p>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <div className="grid gap-1">
                    <span className="text-sm font-semibold text-espresso">Biznesi aktual</span>
                    <div className="text-base font-semibold text-espresso">{dealBusinessName}</div>
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Zgjidh biznesin</label>
                    <select
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={selectedDealBusinessId}
                      onChange={(e) => {
                        setSelectedDealBusinessId(e.target.value);
                        resetDealForm();
                      }}
                      disabled={businesses.length === 0 || dealSubmitting}
                    >
                      {businesses.length === 0 ? <option value="">Nuk ka biznese</option> : null}
                      {businesses.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <form className="mt-4 grid gap-4" onSubmit={onSubmitDeal}>
                  <input
                    className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                    placeholder="Deal title"
                    value={dealForm.title}
                    onChange={(e) => setDealForm((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                  <textarea
                    className="min-h-24 rounded-lg border border-oak/30 bg-white px-3 py-2"
                    placeholder="Deal description"
                    value={dealForm.description}
                    onChange={(e) => setDealForm((prev) => ({ ...prev, description: e.target.value }))}
                    required
                  />

                  <select
                    className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                    value={dealForm.category}
                    onChange={(e) =>
                      setDealForm((prev) => ({ ...prev, category: e.target.value as DealForm["category"] }))
                    }
                  >
                    <option value="Discounts">Discounts</option>
                    <option value="FlashSales">Flash Sales</option>
                    <option value="EarlyAccess">Early Access</option>
                  </select>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      type="number"
                      step="0.01"
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      placeholder="Original price"
                      value={dealForm.originalPrice}
                      onChange={(e) => setDealForm((prev) => ({ ...prev, originalPrice: e.target.value }))}
                    />
                    <input
                      type="number"
                      step="0.01"
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      placeholder="Discounted price"
                      value={dealForm.discountedPrice}
                      onChange={(e) => setDealForm((prev) => ({ ...prev, discountedPrice: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      type="datetime-local"
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={dealForm.startsAt}
                      onChange={(e) => setDealForm((prev) => ({ ...prev, startsAt: e.target.value }))}
                    />
                    <input
                      type="datetime-local"
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={dealForm.expiresAt}
                      onChange={(e) => setDealForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
                    />
                  </div>

                  <label className="flex items-center gap-3 text-espresso">
                    <input
                      type="checkbox"
                      checked={dealForm.isActive}
                      onChange={(e) => setDealForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    />
                    <span>Aktiv</span>
                  </label>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      disabled={dealSubmitting || !selectedDealBusinessId}
                      className="w-full rounded-lg bg-espresso px-4 py-2 font-semibold text-paper disabled:opacity-60 sm:w-fit"
                    >
                      {dealSubmitting ? "Saving..." : editingPromotionId ? "Update Deal" : "Create Deal"}
                    </button>

                    {editingPromotionId ? (
                      <button
                        type="button"
                        onClick={resetDealForm}
                        disabled={dealSubmitting}
                        className="w-full rounded-lg border border-oak/40 bg-white px-4 py-2 font-semibold text-espresso disabled:opacity-60 sm:w-fit"
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>

                  {dealMessage ? <p className="text-green-700">{dealMessage}</p> : null}
                  {dealError ? <p className="text-red-700">{dealError}</p> : null}
                </form>

                <div className="mt-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-bold text-espresso">Deal-et e mia</h2>
                    <button
                      type="button"
                      onClick={() => void refreshPromotions()}
                      disabled={promotionsLoading || !selectedDealBusinessId}
                      className="w-full rounded-lg border border-oak/40 bg-white px-3 py-2 font-semibold text-espresso disabled:opacity-60 sm:w-fit"
                    >
                      Rifresko
                    </button>
                  </div>

                  {promotionsError ? <p className="mt-2 text-red-700">{promotionsError}</p> : null}

                  {promotionsLoading ? (
                    <p className="mt-3 text-espresso/80">Duke ngarkuar...</p>
                  ) : promotions.length === 0 ? (
                    <p className="mt-3 text-espresso/80">Nuk ka deal-e për këtë biznes.</p>
                  ) : (
                    <div className="mt-4 grid gap-3">
                      {promotions.map((p) => (
                        <div key={p.id} className="rounded-xl border border-oak/25 bg-white p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="break-words text-base font-bold text-espresso">{p.title}</p>
                              <p className="mt-1 text-sm text-espresso/70">
                                {p.category} · {p.isActive ? "Active" : "Inactive"}
                              </p>
                              <p className="mt-1 text-sm text-espresso/70">
                                {p.startsAt ? `Start: ${new Date(p.startsAt).toLocaleString()}` : "Start: —"} ·{" "}
                                {p.expiresAt ? `End: ${new Date(p.expiresAt).toLocaleString()}` : "End: —"}
                              </p>
                              {p.originalPrice != null || p.discountedPrice != null ? (
                                <p className="mt-1 text-sm text-espresso/80">
                                  {p.originalPrice != null ? `Original: ${p.originalPrice}` : "Original: —"} ·{" "}
                                  {p.discountedPrice != null ? `Discounted: ${p.discountedPrice}` : "Discounted: —"}
                                  {p.discountPercent != null ? ` · -${p.discountPercent}%` : ""}
                                </p>
                              ) : null}
                              {p.description ? <p className="mt-2 break-words text-espresso/80">{p.description}</p> : null}
                            </div>

                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
                              <button
                                type="button"
                                onClick={() => onEditPromotion(p)}
                                className="w-full rounded-lg border border-oak/40 bg-white px-4 py-2 font-semibold text-espresso sm:w-fit"
                                disabled={dealSubmitting || promotionDeleteId === p.id}
                              >
                                Edito
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setPendingPromoDelete(p);
                                  setPromoConfirmOpen(true);
                                }}
                                className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-semibold text-red-700 disabled:opacity-60 sm:w-fit"
                                disabled={promotionDeleteId === p.id || dealSubmitting}
                              >
                                Fshi
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-oak/35 bg-paper/95 p-5 shadow-panel sm:p-8">
                <h2 className="text-xl font-bold text-espresso sm:text-2xl">Ditët e hapura</h2>
                <p className="mt-2 text-espresso/80">Menaxho ditët e hapura për biznesin tënd. Kjo shfaqet te /opendays.</p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="grid gap-1">
                    <span className="text-sm font-semibold text-espresso">Biznesi aktual</span>
                    <div className="text-base font-semibold text-espresso">{openDaysBusinessName}</div>
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Zgjidh biznesin</label>
                    <select
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={selectedOpenDaysBusinessId}
                      onChange={(e) => {
                        setOpenDaysMessage(null);
                        setOpenDays(defaultOpenDays);
                        setSelectedOpenDaysBusinessId(e.target.value);
                      }}
                      disabled={businesses.length === 0}
                    >
                      {businesses.length === 0 ? <option value="">Nuk ka biznese</option> : null}
                      {businesses.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <form className="mt-4 grid gap-3" onSubmit={onSaveOpenDays}>
                  {openDayLabels.map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 text-espresso">
                      <input
                        type="checkbox"
                        checked={openDays[key]}
                        onChange={(e) => setOpenDays((prev) => ({ ...prev, [key]: e.target.checked }))}
                        disabled={!selectedOpenDaysBusinessId}
                      />
                      <span>{label}</span>
                    </label>
                  ))}

                  <button
                    type="submit"
                    disabled={openDaysLoading || !selectedOpenDaysBusinessId}
                    className="mt-2 w-fit rounded-lg bg-espresso px-4 py-2 font-semibold text-paper disabled:opacity-60"
                  >
                    {openDaysLoading ? "Duke ruajtur..." : "Ruaj ditët e hapura"}
                  </button>

                  {openDaysMessage ? <p className="text-espresso">{openDaysMessage}</p> : null}
                </form>
              </section>
            </>
          ) : null}

          <section className="rounded-2xl border border-oak/35 bg-paper/95 p-5 shadow-panel sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-espresso sm:text-2xl">Bizneset e mia</h2>
                <p className="mt-1 text-espresso/80">Dërgo një biznes të ri ose përditëso një biznes ekzistues.</p>
              </div>

              {bizView.mode === "list" ? (
                <button
                  type="button"
                  onClick={startCreateBusiness}
                  className="w-full rounded-lg bg-espresso px-4 py-2 font-semibold text-paper sm:w-fit"
                >
                  Dërgo biznes të ri
                </button>
              ) : (
                <button
                  type="button"
                  onClick={cancelBusinessForm}
                  className="w-full rounded-lg border border-oak/40 bg-white px-4 py-2 font-semibold text-espresso sm:w-fit"
                >
                  Kthehu te lista
                </button>
              )}
            </div>

            {bizMessage ? <p className="mt-4 text-green-700">{bizMessage}</p> : null}
            {bizError ? <p className="mt-4 text-red-700">{bizError}</p> : null}

            {bizView.mode === "list" ? (
              <div className="mt-6">
                {bizLoading ? (
                  <p className="text-espresso/80">Duke ngarkuar...</p>
                ) : businesses.length === 0 ? (
                  <p className="text-espresso/80">Nuk ke dërguar ende asnjë biznes.</p>
                ) : (
                  <div className="grid gap-4">
                    {businesses.map((b) => (
                      <div key={b.id} className="rounded-xl border border-oak/25 bg-white p-4 sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="break-words text-lg font-bold text-espresso">{b.name}</p>
                            <p className="text-sm text-espresso/70">
                              {b.city ?? "—"} · {b.type ?? "—"} · Status: {b.status ?? "—"}
                            </p>
                          </div>

                          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
                            <button
                              type="button"
                              onClick={() => startEditBusiness(b)}
                              className="w-full rounded-lg border border-oak/40 bg-white px-4 py-2 font-semibold text-espresso sm:w-fit"
                              disabled={deletingId === b.id}
                            >
                              Edito
                            </button>

                            <button
                              type="button"
                              onClick={() => requestDelete(b)}
                              className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-semibold text-red-700 disabled:opacity-60 sm:w-fit"
                              disabled={deletingId === b.id}
                            >
                              Fshi
                            </button>
                          </div>
                        </div>

                        {b.description ? <p className="mt-3 break-words text-espresso/80">{b.description}</p> : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form className="mt-6 grid gap-4" onSubmit={submitBusinessForm}>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Emri i biznesit</label>
                    <input
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.name}
                      onChange={(e) => setBizForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Cafe Uno"
                    />
                    {bizFieldErrors.name ? <p className="text-sm text-red-700">{bizFieldErrors.name}</p> : null}
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Qyteti</label>
                    <select
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.city}
                      onChange={(e) => setBizForm((p) => ({ ...p, city: e.target.value }))}
                    >
                      <option value="" disabled>
                        Zgjidh qytetin
                      </option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {bizFieldErrors.city ? <p className="text-sm text-red-700">{bizFieldErrors.city}</p> : null}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Lloji</label>
                    <select
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.type}
                      onChange={(e) => setBizForm((p) => ({ ...p, type: e.target.value }))}
                    >
                      {BUSINESS_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {bizFieldErrors.type ? <p className="text-sm text-red-700">{bizFieldErrors.type}</p> : null}
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Adresa</label>
                    <input
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.address}
                      onChange={(e) => setBizForm((p) => ({ ...p, address: e.target.value }))}
                      placeholder="Rruga, numri, zona..."
                    />
                    {bizFieldErrors.address ? <p className="text-sm text-red-700">{bizFieldErrors.address}</p> : null}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">
                      Numri i biznesit {isEditBusiness ? "(i bllokuar)" : ""}
                    </label>
                    <input
                      className={`rounded-lg border border-oak/30 px-3 py-2 ${
                        isEditBusiness ? "bg-gray-100 text-gray-700" : "bg-white"
                      }`}
                      value={bizForm.businessNumber}
                      onChange={(e) => setBizForm((p) => ({ ...p, businessNumber: e.target.value }))}
                      placeholder="Numri i regjistrimit"
                      disabled={isEditBusiness}
                    />
                    {!isEditBusiness && bizFieldErrors.businessNumber ? (
                      <p className="text-sm text-red-700">{bizFieldErrors.businessNumber}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">URL e biznesit</label>
                    <input
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.businessUrl}
                      onChange={(e) => setBizForm((p) => ({ ...p, businessUrl: e.target.value }))}
                      placeholder="example.com ose https://example.com"
                    />
                    {bizFieldErrors.businessUrl ? (
                      <p className="text-sm text-red-700">{bizFieldErrors.businessUrl}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Numri i telefonit</label>
                    <input
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.phoneNumber}
                      onChange={(e) => setBizForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                      placeholder="+383..."
                    />
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Email</label>
                    <input
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.email}
                      onChange={(e) => setBizForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="email@domain.com"
                      type="email"
                    />
                  </div>
                </div>

                <div className="grid gap-1">
                  <label className="text-sm font-semibold text-espresso">URL e logos</label>
                  <input
                    className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                    value={bizForm.imageUrl}
                    onChange={(e) => setBizForm((p) => ({ ...p, imageUrl: e.target.value }))}
                    placeholder="https://.../logo.png"
                  />
                </div>

                <div className="grid gap-1">
                  <label className="text-sm font-semibold text-espresso">Përshkrimi</label>
                  <textarea
                    className="min-h-24 rounded-lg border border-oak/30 bg-white px-3 py-2"
                    value={bizForm.description}
                    onChange={(e) => setBizForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Përshkruaj biznesin..."
                  />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={bizSubmitting}
                    className="w-full rounded-lg bg-espresso px-4 py-2 font-semibold text-paper disabled:opacity-60 sm:w-fit"
                  >
                    {bizSubmitting ? "Duke ruajtur..." : isEditBusiness ? "Ruaj ndryshimet" : "Dërgo biznesin"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelBusinessForm}
                    className="w-full rounded-lg border border-oak/40 bg-white px-4 py-2 font-semibold text-espresso sm:w-fit"
                    disabled={bizSubmitting}
                  >
                    Anulo
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>

      <ConfirmDialog
        open={confirmOpen}
        title="Fshij biznesin"
        message={
          pendingDelete
            ? `A je i sigurt që dëshiron ta fshish "${pendingDelete.name}"?\nKy veprim nuk mund të kthehet mbrapsht.`
            : ""
        }
        confirmText="Fshi"
        cancelText="Anulo"
        danger
        loading={!!deletingId}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />

      <ConfirmDialog
        open={promoConfirmOpen}
        title="Fshij deal-in"
        message={
          pendingPromoDelete
            ? `A je i sigurt që dëshiron ta fshish "${pendingPromoDelete.title}"?\nKy veprim nuk mund të kthehet mbrapsht.`
            : ""
        }
        confirmText="Fshi"
        cancelText="Anulo"
        danger
        loading={!!promotionDeleteId}
        onCancel={cancelPromoDelete}
        onConfirm={confirmPromoDelete}
      />
    </>
  );
}

export default function DashboardBusinessPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-5xl">
              <p className="text-espresso/80">Loading...</p>
            </div>
          </main>
        </>
      }
    >
      <DashboardBusinessInner />
    </Suspense>
  );
}