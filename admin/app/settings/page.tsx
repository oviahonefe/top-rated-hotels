"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminRouteGuard from "@/components/layout/AdminRouteGuard";
import AdminShell from "@/components/layout/AdminShell";
import { apiRequest } from "@/lib/api-client";
import { useAdminAuth } from "@/providers/AuthProvider";

type PaymentMethodType = "bank_transfer" | "crypto";

type PaymentDetail = {
  label: string;
  value: string;
};

type PaymentMethod = {
  _id: string;
  displayName: string;
  type: PaymentMethodType;
  currency: string;
  instructions: string;
  details: PaymentDetail[];
  enabled: boolean;
  sortOrder: number;
};

type PaymentMethodDraft = Omit<PaymentMethod, "_id">;

const emptyDraft: PaymentMethodDraft = {
  displayName: "",
  type: "bank_transfer",
  currency: "EUR",
  instructions: "",
  details: [{ label: "", value: "" }],
  enabled: true,
  sortOrder: 0,
};

export default function SettingsPage() {
  return (
    <AdminRouteGuard>
      <PaymentMethodsContent />
    </AdminRouteGuard>
  );
}

function PaymentMethodsContent() {
  const { authenticatedRequestToken } = useAdminAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadMethods() {
    const token = await authenticatedRequestToken();

    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await apiRequest<PaymentMethod[]>("/payment-methods/admin", {
        token,
      });

      setMethods(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load payment methods.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadMethods();
  }, []);

  async function saveMethod(draft: PaymentMethodDraft) {
    const token = await authenticatedRequestToken();

    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const path = selectedMethod
        ? `/payment-methods/admin/${selectedMethod._id}`
        : "/payment-methods/admin";

      const savedMethod = await apiRequest<PaymentMethod>(path, {
        method: selectedMethod ? "PATCH" : "POST",
        token,
        body: draft,
      });

      setMethods((currentMethods) => {
        const exists = currentMethods.some(
          (method) => method._id === savedMethod._id,
        );

        return exists
          ? currentMethods.map((method) =>
              method._id === savedMethod._id ? savedMethod : method,
            )
          : [savedMethod, ...currentMethods];
      });

      setSelectedMethod(savedMethod);
      setMessage(
        selectedMethod
          ? "Payment method updated successfully."
          : "Payment method created successfully.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save payment method.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function disableMethod(method: PaymentMethod) {
    const confirmed = window.confirm(
      `Disable "${method.displayName}"? Guests will no longer see it at checkout.`,
    );

    if (!confirmed) {
      return;
    }

    const token = await authenticatedRequestToken();

    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      return;
    }

    setError("");
    setMessage("");

    try {
      const updatedMethod = await apiRequest<PaymentMethod>(
        `/payment-methods/admin/${method._id}`,
        {
          method: "DELETE",
          token,
        },
      );

      setMethods((currentMethods) =>
        currentMethods.map((item) =>
          item._id === updatedMethod._id ? updatedMethod : item,
        ),
      );

      setSelectedMethod(updatedMethod);
      setMessage("Payment method disabled.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to disable payment method.",
      );
    }
  }

  return (
    <AdminShell>
      <main className="mx-auto w-full max-w-[96rem] px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-5 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f47c20]">
              Checkout operations
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-[#18295d] sm:text-4xl">
              Payment methods
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Configure the secure payment instructions that Top Rated
              Apartment Hotels guests receive after reserving a stay.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedMethod(null);
              setMessage("");
              setError("");
            }}
            className="h-11 bg-[#f47c20] px-5 text-sm font-bold text-white transition hover:bg-[#d96513]"
          >
            Add payment method
          </button>
        </section>

        {error ? (
          <p className="mt-6 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="mt-6 border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
            {message}
          </p>
        ) : null}

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_29rem]">
          <section className="border border-slate-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f47c20]">
                  Checkout configuration
                </p>
                <h2 className="mt-2 text-xl font-extrabold text-[#18295d]">
                  Available payment methods
                </h2>
              </div>

              <button
                type="button"
                onClick={() => void loadMethods()}
                className="h-10 border border-slate-300 px-4 text-sm font-bold text-slate-800 transition hover:border-[#18295d]"
              >
                Refresh
              </button>
            </div>

            {isLoading ? (
              <p className="p-6 text-sm font-semibold text-slate-600">
                Loading payment methods...
              </p>
            ) : methods.length === 0 ? (
              <div className="p-8">
                <h3 className="text-xl font-extrabold text-[#18295d]">
                  No payment methods configured
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                  Add a bank transfer or crypto method before guests can submit
                  payment information for their bookings.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {methods.map((method) => (
                  <article
                    key={method._id}
                    className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-[#18295d]">
                          {method.displayName}
                        </h3>

                        <span
                          className={
                            method.enabled
                              ? "bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800"
                              : "bg-slate-200 px-2 py-1 text-xs font-bold text-slate-700"
                          }
                        >
                          {method.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>

                      <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#f47c20]">
                        {method.type.replaceAll("_", " ")} · {method.currency}
                      </p>

                      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                        {method.instructions}
                      </p>

                      <p className="mt-3 text-xs font-semibold text-slate-500">
                        Checkout display order: {method.sortOrder}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMethod(method);
                          setMessage("");
                          setError("");
                        }}
                        className="h-10 border border-slate-300 px-4 text-sm font-bold text-[#18295d] transition hover:border-[#18295d]"
                      >
                        Edit
                      </button>

                      {method.enabled ? (
                        <button
                          type="button"
                          onClick={() => void disableMethod(method)}
                          className="h-10 border border-red-200 px-4 text-sm font-bold text-red-700 transition hover:bg-red-50"
                        >
                          Disable
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="h-fit border border-slate-200 bg-white p-5 sm:p-6">
            <PaymentMethodForm
              key={selectedMethod?._id ?? "new-payment-method"}
              paymentMethod={selectedMethod}
              isSaving={isSaving}
              onCancel={() => {
                setSelectedMethod(null);
                setMessage("");
                setError("");
              }}
              onSubmit={saveMethod}
            />
          </aside>
        </div>
      </main>
    </AdminShell>
  );
}

function PaymentMethodForm({
  paymentMethod,
  isSaving,
  onCancel,
  onSubmit,
}: {
  paymentMethod: PaymentMethod | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (draft: PaymentMethodDraft) => Promise<void>;
}) {
  const [draft, setDraft] = useState<PaymentMethodDraft>(
    paymentMethod
      ? {
          displayName: paymentMethod.displayName,
          type: paymentMethod.type,
          currency: paymentMethod.currency,
          instructions: paymentMethod.instructions,
          details: paymentMethod.details,
          enabled: paymentMethod.enabled,
          sortOrder: paymentMethod.sortOrder,
        }
      : emptyDraft,
  );

  function updateDetail(
    index: number,
    field: keyof PaymentDetail,
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      details: current.details.map((detail, detailIndex) =>
        detailIndex === index ? { ...detail, [field]: value } : detail,
      ),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      ...draft,
      currency: draft.currency.trim().toUpperCase(),
      details: draft.details.filter(
        (detail) => detail.label.trim() && detail.value.trim(),
      ),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f47c20]">
            Checkout method
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-[#18295d]">
            {paymentMethod ? "Edit method" : "Create method"}
          </h2>
        </div>

        {paymentMethod ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-bold text-[#18295d] hover:text-[#f47c20]"
          >
            New method
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4">
        <Field label="Display name">
          <input
            required
            value={draft.displayName}
            onChange={(event) =>
              setDraft({ ...draft, displayName: event.target.value })
            }
            placeholder="European bank transfer"
            className="field-input"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Payment type">
            <select
              value={draft.type}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  type: event.target.value as PaymentMethodType,
                })
              }
              className="field-input"
            >
              <option value="bank_transfer">Bank transfer</option>
              <option value="crypto">Crypto</option>
            </select>
          </Field>

          <Field label="Currency">
            <input
              required
              maxLength={12}
              value={draft.currency}
              onChange={(event) =>
                setDraft({ ...draft, currency: event.target.value })
              }
              placeholder="EUR"
              className="field-input"
            />
          </Field>
        </div>

        <Field label="Guest instructions">
          <textarea
            required
            minLength={10}
            rows={5}
            value={draft.instructions}
            onChange={(event) =>
              setDraft({ ...draft, instructions: event.target.value })
            }
            placeholder="Tell guests how to complete payment and submit their reference."
            className="field-input resize-y"
          />
        </Field>

        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-slate-700">
              Payment details
            </p>

            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  details: [...draft.details, { label: "", value: "" }],
                })
              }
              className="text-sm font-bold text-[#f47c20] hover:text-[#d96513]"
            >
              Add detail
            </button>
          </div>

          <div className="mt-3 grid gap-3">
            {draft.details.map((detail, index) => (
              <div
                key={index}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2"
              >
                <input
                  required
                  value={detail.label}
                  onChange={(event) =>
                    updateDetail(index, "label", event.target.value)
                  }
                  placeholder="Account name"
                  className="field-input"
                />

                <input
                  required
                  value={detail.value}
                  onChange={(event) =>
                    updateDetail(index, "value", event.target.value)
                  }
                  placeholder="Top Rated Hotels Ltd"
                  className="field-input"
                />

                <button
                  type="button"
                  disabled={draft.details.length === 1}
                  onClick={() =>
                    setDraft({
                      ...draft,
                      details: draft.details.filter(
                        (_, detailIndex) => detailIndex !== index,
                      ),
                    })
                  }
                  className="px-2 text-xs font-bold text-red-700 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Display order">
            <input
              type="number"
              min="0"
              value={draft.sortOrder}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  sortOrder: Number(event.target.value),
                })
              }
              className="field-input"
            />
          </Field>

          <label className="flex h-11 items-center gap-3 self-end border border-slate-300 px-3 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={draft.enabled}
              onChange={(event) =>
                setDraft({ ...draft, enabled: event.target.checked })
              }
              className="h-4 w-4 accent-[#f47c20]"
            />
            Available at checkout
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="mt-6 h-11 w-full bg-[#18295d] px-5 text-sm font-bold text-white transition hover:bg-[#101d48] disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSaving
          ? "Saving..."
          : paymentMethod
            ? "Save payment method"
            : "Create payment method"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      {children}
    </label>
  );
}