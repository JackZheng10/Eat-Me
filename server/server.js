const express = require("./config/express.js");

// Use env port or default
const port = process.env.PORT || 5000;

//start the server and socket io connection
const app = express.init();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.of("/api/socket").on("connection", (socket) => {
  console.log("socket.io: User connected: " + socket.id);

  socket.on("disconnect", () => {
    console.log("socket.io: User disconnected: " + socket.id);
  });

  //connect client to proper room
  let room = socket.handshake.query.phone;

  if (!room) {
    return new Error(
      "Error with joining socket room: Phone not specified/available. Check to make sure a user is logged in."
    );
  } else {
    socket.join(room);
    console.log("socket.io: User joined room " + room);
  }
});

server.listen(port, () => console.log(`Server now running on port ${port}!`));

//export the socket io connection for use in controllers
module.exports.SIO = io;
