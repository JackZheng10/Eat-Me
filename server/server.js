const express = require("./config/express.js");

// Use env port or default
const port = process.env.PORT || 5000;

//start the server
const app = express.init();
app.listen(port, () => console.log(`Server now running on port ${port}!`));
