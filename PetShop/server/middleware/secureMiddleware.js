import csrf from "csurf";
import { authMiddleware } from "./authMiddleware.js";

const csrfProtection = csrf({
  cookie: true,
  value: (req) => {
    // Ưu tiên lấy từ header X-CSRF-Token
    return req.headers["x-csrf-token"] || req.body._csrf || req.query._csrf;
  },
});

// Middleware wrapper
export const secureMiddleware = (req, res, next) => {
  const dangerousMethods = ["POST", "PUT", "PATCH", "DELETE"];

  if (dangerousMethods.includes(req.method)) {
    // Chạy cả auth + csrf
    authMiddleware(req, res, (err) => {
      if (err) return next(err);
      csrfProtection(req, res, next);
    });
  } else {
    // GET/HEAD → chỉ cần auth
    authMiddleware(req, res, next);
  }
};
