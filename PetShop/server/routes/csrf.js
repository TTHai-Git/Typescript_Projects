import { Router } from "express";
import { secureMiddleware } from "../middleware/secureMiddleware.js";
import { getCSRFToken } from "../controllers/csrf.js";
import csrf from "csurf";
const csrfProtection = csrf({ cookie: true });


const csrfRoutes = Router()
csrfRoutes.get("/csrf-token", csrfProtection, getCSRFToken)

export default csrfRoutes