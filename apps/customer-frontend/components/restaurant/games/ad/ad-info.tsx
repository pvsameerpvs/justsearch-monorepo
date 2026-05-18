interface AdInfoProps {
  title: string;
  companyName: string;
  description?: string;
}

export function AdInfo({ title, companyName, description }: AdInfoProps) {
  return (
    <div className="text-center text-white">
      <p className="text-lg font-bold">{title}</p>
      <p className="text-sm text-white/70">{companyName}</p>
      {description && <p className="mt-1 text-xs text-white/50">{description}</p>}
    </div>
  );
}
