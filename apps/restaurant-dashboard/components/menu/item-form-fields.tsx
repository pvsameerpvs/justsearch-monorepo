"use client";

import { ImageUpload } from "@/components/ui/image-upload";

interface ItemFormFieldsProps {
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  price: number;
  setPrice: (v: number) => void;
  currency: string;
  setCurrency: (v: string) => void;
  image: string;
  setImage: (v: string) => void;
  tags: string;
  setTags: (v: string) => void;
  subcategory: string;
  setSubcategory: (v: string) => void;
  isAvailable: boolean;
  setIsAvailable: (v: boolean) => void;
}

export function ItemFormFields(props: ItemFormFieldsProps) {
  const { name, setName, description, setDescription, price, setPrice, currency, setCurrency, image, setImage, tags, setTags, subcategory, setSubcategory, isAvailable, setIsAvailable } = props;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" value={name} onChange={setName} />
        <Field label="Price" value={String(price)} onChange={(v) => setPrice(Number(v))} type="number" />
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="elegant-input w-full mt-1" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Currency" value={currency} onChange={setCurrency} />
        <Field label="Subcategory" value={subcategory} onChange={setSubcategory} placeholder="e.g. Chef Selection" />
      </div>

      <ImageUpload value={image} onChange={setImage} label="Item Image" aspect="landscape" />

      <Field label="Tags (comma separated)" value={tags} onChange={setTags} placeholder="Popular, Vegetarian, Spicy" />

      <label className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
        <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="h-4 w-4 rounded" />
        <span className="text-sm font-medium text-slate-700">Item is available</span>
      </label>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="elegant-input w-full mt-1" />
    </div>
  );
}
