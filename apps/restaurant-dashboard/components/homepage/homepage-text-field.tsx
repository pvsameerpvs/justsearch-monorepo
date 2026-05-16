import { Controller } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import type { HomepageFormData } from "./use-homepage-editor";

interface HomepageTextFieldProps {
  name: keyof HomepageFormData;
  label: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
}

export function HomepageTextField({ name, label, placeholder, control }: HomepageTextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <FormField label={label} value={field.value ?? ""} onChange={field.onChange} placeholder={placeholder} />
          {fieldState.error && <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}
