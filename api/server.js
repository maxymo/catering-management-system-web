const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");

const normalizePort = (val) => {
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
};

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
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
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  console.log("Listening on " + bind);
};

function stop() {
  console.log("Closing server.");
  require("./app").disconnectDatabase();
  server.close();
}

const port = normalizePort(process.env.PORT || "8081");
app.set("port", port);
app.on("databaseReady", function () {
  server.emit("databaseReady");
});
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
module.exports = server.listen(port);
module.exports.stop = stop;
