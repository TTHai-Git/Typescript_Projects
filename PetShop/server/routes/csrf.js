import { Router } from "express";
import { generateCSRFToken } from "../controllers/csrf.js";

const csrfRoutes = new Router();

csrfRoutes.get("/generate-token", generateCSRFToken)

export default csrfRoutes