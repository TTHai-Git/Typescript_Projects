// routes/generateCrudRoutes.js
import express, { Router } from "express";
import { createOne, deleteOne, readAll, readOne, updateOne } from "../controllers/CRUD.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const generateCrudRoutes = (Model) => {
  const router = Router();

  router.post("/",authMiddleware, isAdmin,createOne(Model));
  router.get("/", authMiddleware,isAdmin,readAll(Model));
  router.get("/:id",authMiddleware, isAdmin, readOne(Model));
  router.put("/:id",authMiddleware, isAdmin, updateOne(Model));
  router.delete("/:id", authMiddleware, isAdmin, deleteOne(Model));

  return router;
}

export default generateCrudRoutes
