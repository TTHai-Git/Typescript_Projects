import { Router } from "express";
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole,
} from "../controllers/role.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { csrfMiddleware } from "../middleware/csrf.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const roleRoutes = Router();

roleRoutes.get("/", getRoles);
roleRoutes.get("/:role_id", getRoleById);
roleRoutes.post("/", authMiddleware, csrfMiddleware, isAdmin, createRole);
roleRoutes.put(
  "/:role_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  updateRole
);
roleRoutes.delete(
  "/:role_id",
  authMiddleware,
  csrfMiddleware,
  isAdmin,
  deleteRole
);

export default roleRoutes;
