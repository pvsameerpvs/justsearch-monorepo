"use client";

import Image from "next/image";
import { ChefHat } from "lucide-react";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function LoginLogo({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string;
}) {
  const hasLogo = !!logoUrl;
  const initials = getInitials(name);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-24 w-24 items-center justify-center">
        {hasLogo ? (
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            width={400}
            height={400}
            priority
            className="h-full w-auto object-contain"
            unoptimized={logoUrl?.startsWith("http")}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ChefHat className="h-12 w-12" />
          </div>
        )}
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-slate-900">{name}</h1>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Staff Dashboard
        </p>
      </div>
    </div>
  );
}
