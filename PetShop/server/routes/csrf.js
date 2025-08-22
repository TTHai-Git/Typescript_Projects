import csrf from "csurf";
import { Router } from "express";
import { getCSRFToken } from "../controllers/csrf.js";
const csrfProtection = csrf({
  cookie: true,
  value: (req) => {
    // Ưu tiên lấy từ header X-CSRF-Token
    return req.headers["x-csrf-token"] || req.body._csrf || req.query._csrf;
  },
});

const csrfRoutes = Router();
csrfRoutes.get("/csrf-token", csrfProtection, getCSRFToken);

export default csrfRoutes;
