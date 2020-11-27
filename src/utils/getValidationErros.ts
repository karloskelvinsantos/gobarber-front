import { ValidationError } from 'yup';

interface Erros {
  [key: string]: string;
}

export default function getValidationErros(error: ValidationError): Erros {
  const validationErros: Erros = {};

  error.inner.forEach(erro => {
    validationErros[erro.path] = erro.message;
  });

  return validationErros;
}
