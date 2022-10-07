import { useCallback, useEffect, useRef } from "react";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";

import { useField } from "@unform/core";

import styles from "./styles.module.css";

interface IInputProps extends CurrencyInputProps {
  label: string;
  name: string;
  containerStyle?: any;
}

export default function InputCurrency({
  label,
  name,
  className,
  containerStyle,
  ...rest
}: IInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { defaultValue, error, fieldName, registerField } = useField(name);

  const formatValueWithoutMask = useCallback((value: string) => {
    let inputValueFormatted = value;

    inputValueFormatted = inputValueFormatted.replaceAll(".", "");
    inputValueFormatted = inputValueFormatted.replace(",", ".");
    inputValueFormatted = inputValueFormatted.replace("R$ ", "");

    return inputValueFormatted;
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue(ref) {
        return Number(formatValueWithoutMask(ref.value));
      },
    });
  }, [registerField, fieldName, formatValueWithoutMask]);

  return (
    <div className={`${styles.container} ${containerStyle}`}>
      <div>
        <label htmlFor={fieldName} className={styles.label}>
          {label}
        </label>
        <CurrencyInput
          id={fieldName}
          name={fieldName}
          defaultValue={defaultValue}
          ref={inputRef}
          autoComplete="off"
          placeholder="R$ 0,00"
          decimalSeparator=","
          groupSeparator="."
          prefix="R$ "
          allowNegativeValue={false}
          decimalScale={2}
          className={`
            ${styles.input}
            ${className}
          `}
          {...rest}
        />
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
