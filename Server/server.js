const Api = require("./api.js");
const express = require("express");
const bodyParser = require('body-parser');
const http = require("http");
// const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const path = require('path');

const index = require("./routes/index");
var cors = require('cors')

const app = express();
app.use("/public", express.static(path.join(__dirname, 'public')));

// register routes
app.use(cors())
app.options('*', cors());
app.use(bodyParser.json())
app.use(index);

const server = http.createServer(app);

// const io = socketIo(server); 
// io.on("connection", socket => {
//   console.log("New client connected");
//   myApi.AddSocket(socket)
// });
server.listen(port, () => console.log(`Listening on port ${port}`));