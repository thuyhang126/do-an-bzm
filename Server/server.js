#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require("./app");
const debug = require("debug")("node:server");
const http = require("http");

const appConfig = require("@config/app");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(appConfig.port);
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  console.log(`Server running on ${appConfig.url}:${appConfig.port}`);
});
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

const io = new require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const MessageRepository = require("@message/repositories/MessageRepository");

const JwtToken = require("@utilities/JwtToken");
const { isBuffer } = require("util");

const users = {};

io.use((socket, next) => {
  let error = {
    error: true,
    status: 401,
    message: "401 Unauthorized",
    data: {},
  };

  if (
    socket.handshake.headers.authorization &&
    socket.handshake.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    let token = socket.handshake.headers.authorization.split(" ")[1];

    if (!token) return res.status(error.status).json(error);

    let tokenVerified = JwtToken.verify(token);

    if (tokenVerified.error) {
      error.message = tokenVerified.message;
      return res.status(error.status).json(error);
    }

    socket.auth = tokenVerified.user;

    return next();
  } else {
    next(new Error());
    console.log("Not authenticated");
  }
});

io.on("connection", (socket, next) => {
  const userId = socket.auth.id;
  const socketId = socket.id;

  users[userId] = socketId;

  io.emit("users-online", Object.keys(users));

  console.log("users", users);

  socket.on("seen_messages", async (receiver_id) => {
    console.log("receiver_id", receiver_id, userId);
    let allMessagesNotSeen = await MessageRepository.getAllMessagesNotSeen({
      object_id: receiver_id,
      userId,
    });

    if (allMessagesNotSeen.length) {
      let idMessagesNotSeen = allMessagesNotSeen.map((message) => message.id);

      const listMessageUpdate = await MessageRepository.updateSeenMessage(
        idMessagesNotSeen
      );

      io.to(users[receiver_id]).emit("update-seen-message", listMessageUpdate);
    }
  });

  socket.on("message", async (data) => {
    console.log(data);
    let message;
    if (data.type === "file") {
      message = data;
    } else {
      message = await MessageRepository.sentMessage({
        receiver_id: data.receiver_id,
        sender_id: userId,
        message: data.message,
      });

      message.dataValues.sender_name = data.sender_name;
      message.dataValues.sender_avatar = data.sender_avatar;
      message.dataValues.ref_id = data.ref_id;
    }

    const emitTo = [users[data.receiver_id], users[data.sender_id]];
    io.to(emitTo).emit("sent-message", message);
    io.to(users[data.receiver_id]).emit("show-window-message", message);
    io.to(emitTo).emit("refresh-chat-list", {});
  });

  socket.on("delete-message", async (data) => {
    const isSuccess = await MessageRepository.deleteMessage(data.id);
    if (isSuccess) {
      const emitTo = [users[data.receiver_id], users[data.sender_id]];
      io.to(emitTo).emit("update-message-delete", data.id);
    }
  });

  socket.on("invite-call", async (receiver_id) => {
    console.log("invite-call", receiver_id);
    console.log("users[receiver_id]", users[receiver_id]);
    io.to(users[receiver_id]).emit("accept-call");
  });

  socket.on("disconnect", () => {
    delete users[socket.auth.id];
  });
});

require("./chatserver");
