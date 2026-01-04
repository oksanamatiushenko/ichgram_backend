import express, { Application } from "express";
import cors from "cors";
import path from "path";
import http from "node:http";
import { fileURLToPath } from "url";
import { Server as SocketIOServer } from "socket.io";

import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRouter from "./routers/auth.router.js";
import usersRouter from "./routers/users.router.js";
import postsRouter from "./routers/posts.router.js";
import commentsRouter from "./routers/comments.router.js";
import notificationRouter from "./routers/notification.router.js";

import Notification from "./db/models/Notification.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = (): void => {
  const app: Application = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

  // 🔹 Роуты
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/posts", postsRouter);
  app.use("/api/comments", commentsRouter);
  app.use("/api/notifications", notificationRouter);

  // 🔹 Middleware для 404 и ошибок
  app.use(notFoundHandler);
  app.use(errorHandler);

  // 🔹 HTTP сервер поверх Express
  const port: number = Number(process.env.PORT) || 3000;
  const server = http.createServer(app);

  // 🔹 Socket.IO на том же сервере
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    socket.on("join", (userId: string) => {
      socket.join(userId);
      console.log(`Socket ${socket.id} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  // 🔹 Слежение за коллекцией уведомлений
  Notification.watch().on("change", async (change) => {
    if (change.operationType === "insert") {
      const notification = await Notification.findById(change.fullDocument._id)
        .populate("sender", "username avatarUrl")
        .populate("post", "imageUrl")
        .lean();

      if (notification) {
        io.to(notification.recipient.toString()).emit("newNotification", notification);
      }
    }
  });

  server.listen(port, () => console.log(`Server running on port ${port}`));
};

export default startServer;


// import express, { Application } from "express";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// import notFoundHandler from "./middlewares/notFoundHandler.js";
// import errorHandler from "./middlewares/errorHandler.js";

// import authRouter from "./routers/auth.router.js";
// import usersRouter from "./routers/users.router.js";
// import postsRouter from "./routers/posts.router.js";
// import commentsRouter from "./routers/comments.router.js";
// import notificationRouter from "./routers/notification.router.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const startServer = (): void => {
//   const app: Application = express();

//   app.use(
//     cors({
//       origin: process.env.FRONTEND_URL,
//       credentials: true,
//     })
//   );

//   app.use(express.json());

//   app.use(
//     "/uploads",
//     express.static(path.join(__dirname, "../public/uploads"))
//   );

//   // 🔹 Роуты
//   app.use("/api/auth", authRouter);
//   app.use("/api/users", usersRouter);
//   app.use("/api/posts", postsRouter);
//   app.use("/api/comments", commentsRouter);
//   app.use("/api/notifications", notificationRouter);

//   // 🔹 Middleware для 404 и ошибок
//   app.use(notFoundHandler);
//   app.use(errorHandler);

//   const port: number = Number(process.env.PORT) || 3000;
//   app.listen(port, () => console.log(`Server running on ${port} port`));
// };

// export default startServer;

