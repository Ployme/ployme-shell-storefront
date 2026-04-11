"use client";

import { useState, useTransition } from "react";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import type { Address } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAddressesAction } from "../actions";

function blankAddress(): Address {
  return {
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
  };
}

export function AddressesClient({
  initialAddresses,
}: {
  initialAddresses: Address[];
}) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<Address>(blankAddress());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function persist(next: Address[]) {
    setError(null);
    startTransition(async () => {
      const result = await saveAddressesAction(next);
      if (result.ok) {
        setAddresses(next);
      } else {
        setError(result.error ?? "Save failed");
      }
    });
  }

  function startAdd() {
    setDraft(blankAddress());
    setEditingIndex(-1);
  }

  function startEdit(i: number) {
    setDraft(addresses[i]);
    setEditingIndex(i);
  }

  function submitDraft() {
    if (editingIndex === null) return;
    const next = [...addresses];
    if (editingIndex === -1) {
      next.push(draft);
    } else {
      next[editingIndex] = draft;
    }
    persist(next);
    setEditingIndex(null);
  }

  function remove(i: number) {
    const next = addresses.filter((_, idx) => idx !== i);
    persist(next);
  }

  return (
    <div>
      {addresses.length === 0 && editingIndex === null && (
        <p className="text-sm text-muted-foreground">
          You don&rsquo;t have any saved addresses yet.
        </p>
      )}

      <ul className="space-y-3">
        {addresses.map((addr, i) => (
          <li
            key={i}
            className="flex items-start justify-between gap-4 rounded-sm border border-stone p-4"
          >
            <div className="text-sm text-foreground">
              <p>{addr.line1}</p>
              {addr.line2 && <p>{addr.line2}</p>}
              <p>
                {addr.city}, {addr.postcode}
              </p>
              <p className="text-muted-foreground">{addr.country}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(i)}
                disabled={pending}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Edit"
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => remove(i)}
                disabled={pending}
                className="text-muted-foreground hover:text-terracotta"
                aria-label="Delete"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingIndex !== null ? (
        <div className="mt-5 rounded-sm border border-stone p-5">
          <p className="font-display text-lg italic text-foreground">
            {editingIndex === -1 ? "Add address" : "Edit address"}
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <Label>Address line 1</Label>
              <Input
                value={draft.line1}
                onChange={(e) => setDraft({ ...draft, line1: e.target.value })}
                className="mt-1.5 h-10"
              />
            </div>
            <div>
              <Label>Address line 2</Label>
              <Input
                value={draft.line2 ?? ""}
                onChange={(e) => setDraft({ ...draft, line2: e.target.value })}
                className="mt-1.5 h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  value={draft.city}
                  onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                  className="mt-1.5 h-10"
                />
              </div>
              <div>
                <Label>Postcode</Label>
                <Input
                  value={draft.postcode}
                  onChange={(e) =>
                    setDraft({ ...draft, postcode: e.target.value })
                  }
                  className="mt-1.5 h-10"
                />
              </div>
            </div>
            <div>
              <Label>Country</Label>
              <Input
                value={draft.country}
                onChange={(e) =>
                  setDraft({ ...draft, country: e.target.value })
                }
                className="mt-1.5 h-10"
              />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={submitDraft}
              disabled={pending}
              className="flex h-10 items-center rounded-sm bg-olive px-5 text-[11px] font-medium uppercase tracking-[0.15em] text-cream disabled:opacity-50"
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : "Save"}
            </button>
            <button
              onClick={() => setEditingIndex(null)}
              className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={startAdd}
          className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-sm border border-olive/40 px-5 text-[11px] uppercase tracking-[0.15em] text-olive"
        >
          <Plus className="size-4" /> Add address
        </button>
      )}
      {error && <p className="mt-3 text-sm text-terracotta">{error}</p>}
    </div>
  );
}
