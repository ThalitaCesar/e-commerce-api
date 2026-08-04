import {
  InvalidWebhookSignatureError,
  MercadoPagoConfig,
  Payment as MercadoPagoPayment,
  WebhookSignatureValidator,
} from "mercadopago";

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string });
const paymentClient = new MercadoPagoPayment(client);

type PayerData = {
  email: string;
  cpf?: string;
};

export class MercadoPagoService {
  public async createCardPayment(params: {
    token: string;
    paymentMethodId: string;
    installments: number;
    amount: number;
    description: string;
    payer: PayerData;
    idempotencyKey: string;
  }) {
    return paymentClient.create({
      body: {
        transaction_amount: params.amount,
        token: params.token,
        description: params.description,
        installments: params.installments,
        payment_method_id: params.paymentMethodId,
        payer: {
          email: params.payer.email,
          identification: params.payer.cpf ? { type: "CPF", number: params.payer.cpf } : undefined,
        },
      },
      requestOptions: { idempotencyKey: params.idempotencyKey },
    });
  }

  public async createPixPayment(params: {
    amount: number;
    description: string;
    payer: PayerData;
    idempotencyKey: string;
  }) {
    return paymentClient.create({
      body: {
        transaction_amount: params.amount,
        description: params.description,
        payment_method_id: "pix",
        payer: {
          email: params.payer.email,
          identification: params.payer.cpf ? { type: "CPF", number: params.payer.cpf } : undefined,
        },
      },
      requestOptions: { idempotencyKey: params.idempotencyKey },
    });
  }

  public async getPayment(externalId: string) {
    return paymentClient.get({ id: externalId });
  }

  public verifyWebhookSignature(params: {
    xSignature: string | string[] | undefined;
    xRequestId: string | string[] | undefined;
    dataId: string | string[] | undefined;
  }): boolean {
    try {
      WebhookSignatureValidator.validate({
        xSignature: params.xSignature,
        xRequestId: params.xRequestId,
        dataId: params.dataId,
        secret: process.env.MERCADOPAGO_WEBHOOK_SECRET as string,
        toleranceSeconds: 300,
      });
      return true;
    } catch (error) {
      if (error instanceof InvalidWebhookSignatureError) {
        return false;
      }
      throw error;
    }
  }
}
