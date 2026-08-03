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
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          folder: { type: "string" },
          size: { type: "string" },
          price: { type: "string" },
          user_id: { type: "string" },
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
