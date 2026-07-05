import { useFormContext, Controller } from "react-hook-form";
import React from "react";
import { FormItem } from "./formItem";
import { FormMessage } from "./formMessage";

interface FormFieldProps {
  name: string;
  label?: string;
  children: React.ReactNode;
}

export function FormField({ name, label, children }: FormFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormItem label={label}>
          {React.cloneElement(children as React.ReactElement, {
            ...field,
          })}
          <FormMessage message={fieldState.error?.message} />
        </FormItem>
      )}
    />
  );
}
