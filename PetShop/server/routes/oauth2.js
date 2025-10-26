import { Router } from "express";
import { auth, oauth2CallBack } from "../utils/auth-server.js";
import { isAdmin } from "../middleware/isAdmin.js";

const oauth2Router = new Router();

oauth2Router.get("/auth", isAdmin, auth);
oauth2Router.get("/oauth2callback", isAdmin, oauth2CallBack);

export default oauth2Router;
