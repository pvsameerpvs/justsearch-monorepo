"use client";

import { useState, useEffect } from "react";
import { useMenuStore } from "@/lib/stores/menu-store";
import { X } from "lucide-react";
import { ItemFormFields } from "./item-form-fields";

export function ItemEditorModal({
  categoryId,
  item,
  onClose,
}: {
  categoryId: string;
  item?: { id: string; name: string; description: string; price: number; currency: string; image?: string; tags?: string[]; subcategory?: string; isAvailable: boolean };
  onClose: () => void;
}) {
  const { addItem, updateItem } = useMenuStore();
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item?.price ?? 0);
  const [currency, setCurrency] = useState(item?.currency ?? "AED");
  const [image, setImage] = useState(item?.image ?? "");
  const [tags, setTags] = useState(item?.tags?.join(", ") ?? "");
  const [subcategory, setSubcategory] = useState(item?.subcategory ?? "");
  const [isAvailable, setIsAvailable] = useState(item?.isAvailable ?? true);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSave = () => {
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (item) {
      updateItem(categoryId, item.id, { name, description, price, currency, image: image || undefined, tags: tagList, subcategory: subcategory || undefined, isAvailable });
    } else {
      addItem(categoryId, { name, description, price, currency, image: image || undefined, tags: tagList, subcategory: subcategory || undefined, isAvailable });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900">{item ? "Edit Item" : "Add Item"}</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <ItemFormFields
          name={name} setName={setName}
          description={description} setDescription={setDescription}
          price={price} setPrice={setPrice}
          currency={currency} setCurrency={setCurrency}
          image={image} setImage={setImage}
          tags={tags} setTags={setTags}
          subcategory={subcategory} setSubcategory={setSubcategory}
          isAvailable={isAvailable} setIsAvailable={setIsAvailable}
        />

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="elegant-btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} className="elegant-btn-primary flex-1">{item ? "Update" : "Add"} Item</button>
        </div>
      </div>
    </div>
  );
}
