interface AdInfoProps {
  title: string;
  linkUrl: string;
  description?: string;
  visibility: Record<string, boolean>;
}

export function AdInfo({ title, linkUrl, description, visibility }: AdInfoProps) {
  const showTitle = visibility?.title !== false;
  const showDescription = visibility?.description === true;
  const showLink = visibility?.linkUrl !== false;
  const hasLink = typeof linkUrl === 'string' && linkUrl.startsWith("http");

  return (
    <div className="text-center text-white">
      {showTitle && (showLink && hasLink ? (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-white underline-offset-2 hover:underline">
          {title}
        </a>
      ) : (
        <p className="text-lg font-bold">{title}</p>
      ))}
      {showDescription && description && <p className="mt-1 text-xs text-white/50">{description}</p>}
    </div>
  );
}
