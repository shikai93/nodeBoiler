const express = require("express");
const config = require("./config/config")
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require("http");
// const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const path = require('path');

const index = require("./routes/index");

const app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(function(req, res, next) {
    var frontendUrl = config.frontendURL
    if (!(process.env.NODE_ENV !== undefined && process.env.NODE_ENV == "PROD")) {
        frontendUrl = "http://localhost:3000"
    }
    if (frontendUrl.slice(-1) == "/") {
        frontendUrl = frontendUrl.slice(0, -1); 
    }
    res.append('Access-Control-Allow-Credentials', true);
    res.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.append("Access-Control-Allow-Origin", [frontendUrl]);
    res.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-PINGOTHER, Content-Type, Accept, Authorization");
    next();
});

app.use("/public", express.static(path.join(__dirname, 'public')));

app.use(cookieParser(config.secretCookie));
app.use(bodyParser.json())
app.use(index);

const server = http.createServer(app);

// const io = socketIo(server); 
// io.on("connection", socket => {
//   console.log("New client connected");
//   myApi.AddSocket(socket)
// });
server.listen(port, () => console.log(`Listening on port ${port}`));