import express from "express";
import  authenticate  from "../middlewares/authenticate.js";
import {
  getNotifications,
  markAllAsRead,
} from "../controllers/notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.get("/", authenticate, getNotifications);
notificationRouter.put("/read", authenticate, markAllAsRead);

export default notificationRouter;