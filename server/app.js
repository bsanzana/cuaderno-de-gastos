require("dotenv").load();
require("./api/models/index");
require("./api/config/passport");

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const fs = require('fs');





const app = express();
// const port = process.env.PORT || 3450;

var port = normalizePort(process.env.PORT || "3450");
app.set("port", port);

const api = require("./api/routes");

mongoose.Promise = global.Promise;
mongoose.set("debug", true);

// mongoose.connect("mongodb://localhost:27017/consulagro", { useNewUrlParser: true });
mongoose
  .connect("mongodb://localhost:27017/consulagro", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database connected sucessfully ");

      app.listen(port, () => {
        console.log("Connected to port " + port);
      });

      app.on("error", onError);
      app.on("listening", onListening);
    },
    (error) => {
      console.log("Could not connected to database : " + error);
    }
  );

app.use(cors());
// app.listen(port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../newClient/dist/browser")));
app.use(passport.initialize());
app.use("/api/v1", api);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../newClient/dist/browser/index.html"));
});

crearCarpeta('./uploads/')
crearCarpeta('./uploads/guia_analisis')
crearCarpeta('./uploads/avatar')
crearCarpeta('./uploads/logo')
crearCarpeta('./uploads/firma')
crearCarpeta('./uploads/analisis_suelo')
crearCarpeta('./uploads/adopcion1')
crearCarpeta('./uploads/adopcion2')

function crearCarpeta(dirPath){
  // Ruta de la carpeta que quieres crear
  const newDir = path.join(__dirname, dirPath);
  if (!fs.existsSync(newDir)) {
    // Si la carpeta no existe, la crea
    fs.mkdirSync(dirPath);
    console.log(`Carpeta creada: ${newDir}`);
  } else {
    console.log(`La carpeta ya existe: ${newDir}`);
  }
}



module.exports = app;

function normalizePort(val) {
  var port = parseInt(val, 10);

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

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
