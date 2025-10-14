import { Router } from "express";
import { welcomeToAPIOfPetShop, welcomeToServer } from "../controllers/base.js";

const baseRoutes = new Router();

baseRoutes.get("/", welcomeToServer)
baseRoutes.get("/v1", welcomeToAPIOfPetShop)

export default baseRoutes;