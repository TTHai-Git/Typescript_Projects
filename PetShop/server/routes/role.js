import { Router } from "express";
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole,
} from "../controllers/role.js";

const roleRoutes = Router();

roleRoutes.get("/", getRoles);
roleRoutes.get("/:role_id", getRoleById);
roleRoutes.post("/", createRole);
roleRoutes.put("/:role_id", updateRole);
roleRoutes.delete("/:role_id", deleteRole);

export default roleRoutes;
