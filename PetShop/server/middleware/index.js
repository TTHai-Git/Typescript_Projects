import express from "express";
import cookieParser from "cookie-parser";
import corsInit from "./cors.js";
import initHelmet from "./helmet.js";
import limiter from "./limiter.js";

export default function initMiddlewares(app) {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(corsInit());
  initHelmet(app);
  app.use(limiter); // global limiter (optional)
}
