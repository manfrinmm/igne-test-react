import { ValidationError } from "yup";

interface IErrors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): IErrors {
  const validationErrors: IErrors = {};

  err.inner.forEach(error => {
    validationErrors[error.path || 0] = error.message;
  });

  return validationErrors;
}
