import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "E-commerce API",
    version: "1.0.0",
    description: "Documentação da API de e-commerce (usuários, produtos, pedidos e endereços).",
  },
  servers: [
    { url: "https://e-commerce-api-3swp.onrender.com", description: "Produção" },
    { url: "http://localhost:3003", description: "Local" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          data: { type: "string", description: "Data de nascimento" },
          cpf: { type: "string" },
          role: { type: "string", enum: ["ADMIN", "NORMAL"] },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "string" },
          created: { type: "string" },
          category: {
            type: "string",
            enum: ["FEM", "MASC", "SPORT", "BA", "FOOTWEAR"],
          },
          folder: { type: "string" },
          weight: { type: "number", description: "Peso em kg, usado no cálculo de frete" },
          height: { type: "number", description: "Altura em cm" },
          width: { type: "number", description: "Largura em cm" },
          length: { type: "number", description: "Comprimento em cm" },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string" },
          product_id: { type: "string" },
          variation_size_id: { type: "string", nullable: true },
          variation_name: { type: "string", nullable: true },
          name: { type: "string" },
          folder: { type: "string" },
          size: { type: "string" },
          price: { type: "string" },
          quantity: { type: "integer" },
          user_id: { type: "string" },
          status: { type: "string" },
        },
      },
      Variation: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          product_id: { type: "string" },
        },
      },
      VariationSize: {
        type: "object",
        properties: {
          id: { type: "string" },
          variation_id: { type: "string" },
          size: { type: "string" },
          price: { type: "string" },
          quantity: { type: "integer", description: "Quantidade em estoque" },
        },
      },
      Adresses: {
        type: "object",
        properties: {
          id: { type: "string" },
          cep: { type: "string" },
          street: { type: "string" },
          district: { type: "string" },
          city: { type: "string" },
          complement: { type: "string" },
          state: { type: "string" },
          number: { type: "string" },
          user_id: { type: "string" },
        },
      },
      Payment: {
        type: "object",
        properties: {
          id: { type: "string" },
          order_id: { type: "string" },
          user_id: { type: "string" },
          method: { type: "string", enum: ["CREDIT_CARD", "DEBIT_CARD", "PIX"] },
          status: { type: "string", description: "Status devolvido pelo Mercado Pago (pending, approved, rejected, ...)" },
          amount: { type: "number" },
          external_id: { type: "string", description: "Id do pagamento no Mercado Pago" },
          qr_code: { type: "string" },
          qr_code_base64: { type: "string" },
          ticket_url: { type: "string" },
        },
      },
      Promotion: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          discount_percent: { type: "number" },
          start_date: { type: "string" },
          end_date: { type: "string" },
          active: { type: "boolean" },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["./src/controller/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
