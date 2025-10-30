import swaggerJSDoc from "swagger-jsdoc";
import "./dotenv.config.js"; // ✅ loads environment variables once
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DOGSHOP API DOCUMENTATION",
      version: "1.0.0",
      description: "API documentation for DogShop project",
    },
    servers: [
      {
        url:
          process.env.REACT_APP_NODE_ENV === "development"
            ? process.env.LOCAL_SERVER_URL
            : process.env.PUBLIC_SERVER_URL,
        description: "Server environment",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT access token stored in HttpOnly cookie named `accessToken`.",
        },
        csrfAuth: {
          type: "apiKey",
          in: "header", // ✅ must be header, not cookie
          name: "X-CSRF-Token", // ✅ lowercase name that matches your middleware
          description:
            "CSRF protection header that must match the value of the `XSRF-TOKEN` cookie.",
        },
        isAdminAuth: {
          type: "apiKey",
          in: "header",
          name: "adminKey",
          description:
            "To protect methods POST, PUT, PATCH, DELETE for APIs of Admin.",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
        csrfAuth: [],
        isAdminAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // path to your route files containing Swagger docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
export default swaggerDocs;
