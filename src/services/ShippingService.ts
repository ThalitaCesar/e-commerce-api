import { ProductData } from "../data/ProductData";
import { AppError } from "../utils/AppError";
import { parsePrice } from "../utils/price";
import { MelhorEnvioService } from "./MelhorEnvioService";

export class ShippingService {

  constructor(
    private productData = new ProductData(),
    private melhorEnvio = new MelhorEnvioService(),
  ) {}

  async calculate(params: { destinationPostalCode: string; items: { productId: string; quantity: number }[] }) {
    const originPostalCode = process.env.STORE_ORIGIN_ZIP_CODE;
    if (!originPostalCode) {
      throw new AppError("CEP de origem da loja não configurado", 500);
    }

    const products = await this.productData.getProductsByIds(params.items.map((item) => item.productId));

    const missingIds = params.items
      .map((item) => item.productId)
      .filter((productId) => !products.some((product) => product.id === productId));
    if (missingIds.length > 0) {
      throw new AppError(`Produto(s) não encontrado(s): ${missingIds.join(", ")}`, 404);
    }

    const incomplete = products.filter(
      (product) => !product.weight || !product.height || !product.width || !product.length
    );
    if (incomplete.length > 0) {
      throw new AppError(
        `Produto(s) sem peso/dimensões cadastrados: ${incomplete.map((product) => product.name).join(", ")}`,
        422
      );
    }

    const shippingProducts = params.items.map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId)!;
      return {
        id: product.id,
        weight: product.weight as number,
        height: product.height as number,
        width: product.width as number,
        length: product.length as number,
        insurance_value: parsePrice(product.price),
        quantity: item.quantity,
      };
    });

    const quotes = await this.melhorEnvio.calculateShipping({
      originPostalCode,
      destinationPostalCode: params.destinationPostalCode,
      products: shippingProducts,
    });

    return quotes
      .filter((quote) => !quote.error && quote.custom_price)
      .map((quote) => ({
        service: quote.name,
        company: quote.company?.name,
        price: quote.custom_price,
        deliveryTime: quote.custom_delivery_time,
      }));
  }
}
