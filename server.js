const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const config = require("./config/app");
const db = require("./database/db"); // Import the database connection
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "yourSecretKey";
const authMiddleware = require("./middleware/authMiddleware");
const permissionMiddleware = require("./middleware/permissionMiddleware");
const upload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const sanitize = require('express-mongo-sanitize');
const { errorHandler } = require('./middleware/error')


const app = express();
app.use(upload()); //for uploading of file

app.use(cookieParser()); //cookies

app.use(  //sessions
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
); // session

app.use(morgan("dev"));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));
app.use(express.static(__dirname + "/public"));
// Define routes

//sanitize
app.use(sanitize())


// app.use('/', authRoutes);
app.use("/api/users", authRoutes);

// app.use('/api/admin',authMiddleware ,permissionMiddleware,usersRoutes);
app.use("/api/admin", usersRoutes);

app.use(errorHandler);

app.use("/*", function (req, res) {
  res.json(404).status("invalid url");
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

// //Load HTTP module
// const http = require("http");
// const hostname = "127.0.0.1";
// const port = 3000;

// //Create HTTP server and listen on port 3000 for requests
// const server = http.createServer((req, res) => {
//   //Set the response HTTP header with HTTP status and Content type
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   res.end("Hello World\n");
// });

// //listen for request on port 3000, and as a callback function have the port listened on logged
// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
