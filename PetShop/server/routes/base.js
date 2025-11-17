import { Router } from "express";
import { welcomeToAPIOfPetShop, welcomeToServer } from "../controllers/base.js";

const baseRoutes = new Router();

baseRoutes.get("/healthz", welcomeToServer);
baseRoutes.get("/v1/healthz", welcomeToAPIOfPetShop);

export default baseRoutes;
