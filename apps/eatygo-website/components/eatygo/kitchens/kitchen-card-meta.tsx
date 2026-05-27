interface KitchenCardMetaProps {
  priceNote: string;
}

export function KitchenCardMeta({ priceNote }: KitchenCardMetaProps) {
  return (
    <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-sm text-slate-500">
      <span className="font-medium text-ink">{priceNote}</span>
    </div>
  );
}
