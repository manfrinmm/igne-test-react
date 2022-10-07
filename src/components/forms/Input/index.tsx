import { InputHTMLAttributes, useEffect, useRef } from "react";

import { useField } from "@unform/core";
import { overrideTailwindClasses } from "tailwind-override";

import styles from "./styles.module.css";

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
        `${styles.container} ${containerClass}`,
      )}
    >
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>

      <input
        id={fieldName}
        name={fieldName}
        ref={inputRef}
        defaultValue={defaultValue}
        type="text"
        autoComplete="off"
        className={overrideTailwindClasses(`${styles.input} ${className}`)}
        {...rest}
      />

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
