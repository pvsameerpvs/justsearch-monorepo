import { useWatch } from "react-hook-form";
import { MenuHeroPreview } from "./menu-hero-preview";
import type { HomepageFormData } from "./use-homepage-editor";

interface HomepageLivePreviewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  theme: Record<string, string>;
}

export function HomepageLivePreview({ control, theme }: HomepageLivePreviewProps) {
  const hero = useWatch({ control, name: "heroImageUrl" }) || "";
  const logo = useWatch({ control, name: "logoUrl" }) || "";
  const name = useWatch({ control, name: "name" }) || "";
  const tagline = useWatch({ control, name: "tagline" }) || "";
  const description = useWatch({ control, name: "description" }) || "";
  const category = useWatch({ control, name: "category" }) || "";
  const cuisine = useWatch({ control, name: "cuisine" }) || "";
  const hours = useWatch({ control, name: "hours" }) || "";

  return (
    <MenuHeroPreview
      heroUrl={hero}
      logoUrl={logo}
      name={name}
      tagline={tagline}
      description={description}
      category={category}
      cuisine={cuisine}
      hours={hours}
      theme={theme}
    />
  );
}
