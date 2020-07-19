let io;

const initializeSocket = (server) => {
  io = require("socket.io")(server);

  io.on("connection", (socket) => {
    console.log("socket.io: User connected: " + socket.id);

    socket.on("disconnect", () => {
      console.log("socket.io: User disconnected: " + socket.id);
    });
  });

  server.listen(process.env.PORT || 6000);
};

exports.initializeSocket = initializeSocket;
exports.io = io;
