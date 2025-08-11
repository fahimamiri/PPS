const createError = require("http-errors");
const express = require("express");

const livereload = require("livereload");
const path = require("path");

const requestTime = require("./middleware/request-time");
const router = express.Router();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(requestTime);

// Serve static files from the "static" directory in the "backend" folder
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));

const rootRoutes = require("./routes/root");
app.use("/", rootRoutes);

// Default route
// Default route
app.get("/", (request, response) => {
  response.render('home');
});

// Route for /contact


// Middleware to handle 404 errors
app.use((request, response, next) => {
    next(createError(404));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

if (process.env.NODE_ENV === "development") {
    const liveReloadServer = livereload.createServer();
   liveReloadServer.watch(path.join(__dirname, "static"));
  liveReloadServer.server.once("connection", () => {
      setTimeout(() => {
        liveReloadServer.refresh("/");
      }, 100);
    });
  }
