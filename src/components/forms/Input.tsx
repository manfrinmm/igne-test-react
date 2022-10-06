import { InputHTMLAttributes } from "react";
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
        id={name}
        name={name}
        type="text"
        autoComplete="off"
        className={overrideTailwindClasses(
          `w-full mt-1 border-solid border rounded p-1 ${className}`,
        )}
        {...rest}
      />
    </div>
  );
}
