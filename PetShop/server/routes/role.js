import { Router } from "express";
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole,
} from "../controllers/role.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { secureMiddleware } from "../middleware/secureMiddleware.js";

const roleRoutes = Router();

roleRoutes.get("/", getRoles);
roleRoutes.get("/:role_id", getRoleById);
roleRoutes.post("/", secureMiddleware, isAdmin, createRole);
roleRoutes.put("/:role_id", secureMiddleware, isAdmin, updateRole);
roleRoutes.delete("/:role_id", secureMiddleware, isAdmin, deleteRole);

export default roleRoutes;
