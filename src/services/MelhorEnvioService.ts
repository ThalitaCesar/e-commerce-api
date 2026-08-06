import { AppError } from "../utils/AppError";

const BASE_URL =
  process.env.MELHOR_ENVIO_SANDBOX === "true" ? "https://sandbox.melhorenvio.com.br" : "https://melhorenvio.com.br";

type ShippingProduct = {
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  insurance_value: number;
  quantity: number;
};

type MelhorEnvioQuote = {
  id: number;
  name: string;
  price: string;
  custom_price: string;
  delivery_time: number;
  custom_delivery_time: number;
  company: { id: number; name: string; picture: string };
  error?: string;
};

export class MelhorEnvioService {
  public async calculateShipping(params: {
    originPostalCode: string;
    destinationPostalCode: string;
    products: ShippingProduct[];
  }): Promise<MelhorEnvioQuote[]> {
    const response = await fetch(`${BASE_URL}/api/v2/me/shipment/calculate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        "User-Agent": process.env.MELHOR_ENVIO_USER_AGENT || "e-commerce-api",
      },
      body: JSON.stringify({
        from: { postal_code: params.originPostalCode },
        to: { postal_code: params.destinationPostalCode },
        products: params.products,
      }),
    });

    if (!response.ok) {
      throw new AppError("Não foi possível calcular o frete no momento", 502);
    }

    return response.json();
  }
}
