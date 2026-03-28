import swaggerJsDoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const isProduction = process.env.NODE_ENV === "production";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Final Project API",
      version: "1.0.0",
      description: "API for the Web Application Course final project",
    },
    servers: [
      {
        url: isProduction
          ? process.env.SERVER_URL || "https://node16.cs.colman.ac.il"
          : "http://localhost:3001",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;