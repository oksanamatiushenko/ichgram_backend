import express, { Application } from "express";
import cors from "cors";

import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRouter from "./routers/auth.router.js";
import usersRouter from "./routers/users.router.js";
import postsRouter from "./routers/posts.router.js";
import commentsRouter from "./routers/comments.router.js";
import notificationRouter from "./routers/notification.router.js";

const startServer = (): void => {
  const app: Application = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));

  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/posts", postsRouter);
  app.use("/api/comments", commentsRouter);
  app.use("/api/notifications", notificationRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const port: number = Number(process.env.Port) || 3000;
  app.listen(port, () => console.log(`Server running on ${port} port`));
};

export default startServer;
