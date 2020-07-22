const express = require("express"),
  mongoose = require("mongoose"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  userRoutes = require("../routes/userRoutes"),
  twilioRoutes = require("../routes/twilioRoutes"),
  simpleRoutes = require("../routes/simpleRoutes"),
  yelpRoutes = require("../routes/yelpRoutes"),
  googleRoutes = require("../routes/googleRoutes"),
  cors = require("cors");

module.exports.init = () => {
  //connect to db
  mongoose.connect(process.env.DB_URI || require("./config").db.uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  //initialize app
  const app = express();

  app.use(cors());

  //morgan used for logging HTTP requests to the console
  app.use(morgan("dev"));

  //bodyParser middleware used for resolving the req and res body objects (urlEncoded and json formats)
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB database connected");
  });
  connection.on("error", (error) =>
    console.log("Error with connecting to MongoDB database: ", error)
  );

  //add routers
  app.use("/api/user", userRoutes);
  app.use("/api/twilio", twilioRoutes);
  app.use("/api/simple", simpleRoutes);
  app.use("/api/yelp", yelpRoutes);
  app.use("/api/google", googleRoutes);

  return app;
};
