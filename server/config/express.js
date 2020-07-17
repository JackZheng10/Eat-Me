const path = require("path"),
  express = require("express"),
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

    //prob will not use in favor of regular pusher events
    // console.log("Setting change streams");
    // const userChangeStream = connection.collection("users").watch();
    // userChangeStream.on("change", (change) => {
    //   console.log(change);
    // });
  });
  connection.on("error", (error) => console.log("Error: " + error));

  //add routers
  app.use("/api/user", userRoutes);
  app.use("/api/twilio", twilioRoutes);
  app.use("/api/simple", simpleRoutes);
  app.use("/api/yelp", yelpRoutes);
  app.use("/api/google", googleRoutes);

  //for production build
  if (process.env.NODE_ENV === "production") {
    //Serve any static files
    app.use(express.static(path.join(__dirname, "../../client/build")));

    //Handle React routing, return all requests to React app
    app.get("*", function (req, res) {
      res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
    });
  }

  return app;
};
