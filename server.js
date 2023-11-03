const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const config = require("./config/app");
const db = require("./database/db"); // Import the database connection
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");
const permissionMiddleware = require("./middleware/permissionMiddleware");
const upload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const sanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const limiter =require('./utils/throttling');
const { errorHandler } = require('./middleware/error')


const app = express();

 //for uploading of file
app.use(upload());

 //cookies
app.use(cookieParser());

//sessions
app.use(  
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

app.use(morgan("dev"));

// body parser
app.use(bodyParser.json());

// set path for views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

//set path for assets
app.use(express.static(__dirname + "/public"));

//rate limiter (throttling)
app.use(limiter)


//sanitize (prevents email or fields from getting data if provided empty,prevents sql injection attacks)
app.use(sanitize())

//add protection headers to routes
app.use(helmet())


// app.use('/', authRoutes);
app.use("/api/users", authRoutes);

app.use('/api/admin',authMiddleware ,permissionMiddleware,usersRoutes);
// app.use("/api/admin", usersRoutes);

// error  handler
app.use(errorHandler);

//handles unhandled requests
app.use("/*", function (req, res) {
  res.json(404).status("invalid url");
});

//create server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
