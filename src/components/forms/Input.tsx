import { InputHTMLAttributes, useEffect, useRef } from "react";

import { useField } from "@unform/core";
import { overrideTailwindClasses } from "tailwind-override";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  containerClass?: string;
}

export default function Input({
  label,
  name,
  containerClass,
  className,
  ...rest
}: IInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { defaultValue, error, fieldName, registerField } = useField(name);

  useEffect(() => {
    registerField({ name: fieldName, ref: inputRef.current, path: "value" });
  }, [registerField, fieldName]);

  return (
    <div
      className={overrideTailwindClasses(
        `flex flex-col w-full ${containerClass}`,
      )}
    >
      <label className="text-sm" htmlFor={name}>
        {label}
      </label>

      <input
        id={fieldName}
        name={fieldName}
        ref={inputRef}
        defaultValue={defaultValue}
        type="text"
        autoComplete="off"
        className={overrideTailwindClasses(
          `w-full mt-1 border-solid border rounded p-1 ${className}`,
        )}
        {...rest}
      />

      {error && <span className="text-red-900 font-bold">{error}</span>}
    </div>
  );
}
