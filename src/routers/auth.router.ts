import { Router } from "express";

import {
  registerController,
  loginController,
  getCurrentController,
  logoutController,
} from "../controllers/auth.controller.js";

import authenticate from "../middlewares/authenticate.js";

const authRouter = Router();

authRouter.post("/register", registerController);

authRouter.post("/login", loginController);

authRouter.get("/current", authenticate, getCurrentController);

authRouter.post("/logout", logoutController);

export default authRouter;
