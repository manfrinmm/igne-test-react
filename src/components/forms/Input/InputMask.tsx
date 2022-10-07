import {
  useEffect,
  useRef,
  CSSProperties,
  useMemo,
  useState,
  InputHTMLAttributes,
} from "react";
import ReactInputMask, { Props as InputProps } from "react-input-mask";

import { useField } from "@unform/core";
import { overrideTailwindClasses } from "tailwind-override";

import styles from "./styles.module.css";

type IInputMaskProps = InputHTMLAttributes<HTMLInputElement> &
  Omit<InputProps, "mask">;

interface IInputProps extends IInputMaskProps {
  name: string;
  label: string;
  containerStyle?: CSSProperties;
  maskType: "cep" | "cpf" | "cnpj" | "phone";
}

export default function InputMask({
  label,
  name,
  maskType,
  className,
  containerStyle = {},
  ...rest
}: IInputProps) {
  const inputRef = useRef(null);

  const { defaultValue, error, fieldName, registerField } = useField(name);

  const [inputDataValue, setInputDataValue] = useState(String(defaultValue));

  const maskInput = useMemo(() => {
    let mask = "";

    switch (maskType) {
      case "cep":
        mask = "99999-999";

        break;

      case "cnpj":
        mask = "99.999.999/9999-99";

        break;

      case "cpf":
        mask = "999.999.999-99";

        break;

      case "phone":
        mask = "+55 (99) 9 9999 9999";

        break;

      default:
        break;
    }

    return mask;
  }, [maskType]);

  useEffect(() => {
    registerField({
      name: fieldName,

      ref: inputRef.current,

      getValue(ref: any) {
        let inputValue = ref.value as string;

        inputValue = inputValue.replaceAll("_", "");
        switch (maskType) {
          case "cep":
            inputValue = inputValue.replace("-", "");

            break;
          case "cnpj":
            inputValue = inputValue.replaceAll(".", "");
            inputValue = inputValue.replaceAll("-", "");
            inputValue = inputValue.replaceAll("/", "");

            break;
          case "cpf":
            inputValue = inputValue.replace(".", "");
            inputValue = inputValue.replace("-", "");

            break;
          case "phone":
            inputValue = inputValue.replaceAll(" ", "");
            inputValue = inputValue.replace("(", "");
            inputValue = inputValue.replace(")", "");

            break;
          default:
            break;
        }

        return inputValue;
      },

      setValue(ref, value) {
        setInputDataValue(String(value));
      },
    });
  }, [registerField, fieldName, maskType]);

  return (
    <div className={styles.container} style={containerStyle}>
      <label htmlFor={fieldName} className={styles.label}>
        {label}
      </label>

      <ReactInputMask
        id={fieldName}
        name={fieldName}
        ref={inputRef}
        mask={maskInput}
        onChange={(e: any) => {
          const { value } = e.target;
          setInputDataValue(value);
        }}
        alwaysShowMask={false}
        maskPlaceholder={null}
        value={inputDataValue}
        className={overrideTailwindClasses(`
          ${styles.input}
          ${className}
          `)}
        {...rest}
      />

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
