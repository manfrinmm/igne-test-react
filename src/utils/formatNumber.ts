interface IFormatNumberDTO {
  type: "cpf" | "cnpj" | "currency";
  data: string | number;
}

export default function formatNumber({ data, type }: IFormatNumberDTO): string {
  if (type === "cpf") {
    return String(data).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  if (type === "cnpj") {
    return String(data).replace(
      /(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/,
      "$1.$2.$3/$4-$5",
    );
  }

  if (type === "currency") {
    return Intl.NumberFormat("pt-br", {
      currency: "brl",
      style: "currency",
    }).format(Number(data));
  }

  return "invalid";
}
