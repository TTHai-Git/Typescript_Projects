import { Router } from "express";
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole,
} from "../controllers/role.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const roleRoutes = Router();

roleRoutes.get("/", getRoles);
roleRoutes.get("/:role_id", getRoleById);
roleRoutes.post("/", authMiddleware, isAdmin, createRole);
roleRoutes.put("/:role_id", authMiddleware, isAdmin, updateRole);
roleRoutes.delete("/:role_id", authMiddleware, isAdmin, deleteRole);

export default roleRoutes;
