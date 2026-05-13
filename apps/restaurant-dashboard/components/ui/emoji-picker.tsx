"use client";

import { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";

const EMOJI_GROUPS = [
  { label: "Popular", emojis: ["🍕", "🍔", "🍟", "🌭", "🍿", "🥓", "🥚", "🥞", "🥐", "🥨", "🥯", "🧇"] },
  { label: "Healthy", emojis: ["🥗", "🥙", "🥪", "🌮", "🌯", "🫔", "🥬", "🥦", "🥕", "🥒", "🥑", "🍅"] },
  { label: "Mains", emojis: ["🍖", "🍗", "🥩", "🍠", "🥘", "🍲", "🥣", "🍛", "🍜", "🍝", "🍤", "🥟"] },
  { label: "Seafood", emojis: ["🐟", "🐠", "🐡", "🦈", "🐙", "🦑", "🦐", "🦞", "🦀", "🐚", "🦪", "🍥"] },
  { label: "Dessert", emojis: ["🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍡"] },
  { label: "Drinks", emojis: ["☕", "🍵", "🧃", "🥤", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🧉"] },
];

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  size?: "sm" | "md";
}

export function EmojiPicker({ value, onChange, size = "md" }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const btnSize = size === "sm" ? "h-8 w-8 text-base" : "h-10 w-10 text-xl";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors ${btnSize}`}
        type="button"
      >
        {value || <Smile className="h-4 w-4 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Pick an emoji</p>
          <div className="max-h-64 space-y-4 overflow-y-auto pr-1">
            {EMOJI_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">{group.label}</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {group.emojis.map((emoji, idx) => (
                    <button
                      key={`${group.label}-${idx}`}
                      onClick={() => { onChange(emoji); setIsOpen(false); }}
                      className={`flex h-8 items-center justify-center rounded-lg text-lg transition-colors hover:bg-slate-100 ${value === emoji ? "bg-amber-50 ring-1 ring-amber-200" : ""}`}
                      type="button"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
