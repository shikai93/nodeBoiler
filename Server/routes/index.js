const express = require("express");
const API = require("../api.js");
const router = express.Router();
const api = new API()

callback = (res,value,err) => {
  if (err === null) {
    res.send({ success: true, value : value }).status(200);
  } else {
    console.log(res,value,err)
    res.send({ success: false, error : err }).status(500);
  }
}
authorize = (res, req, callback)=>{
  api.VerifyJWT(req,(token,error) => {
    if (error !== null) {
      res.send({ success: false, error : error }).status(500);
    } else {
      callback(res,token,null);
    }
  })
}

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

// LOGIN ROUTES
router.post("/login", (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (username == null || password == null ) {
    res.send({ success: false, error : "Missing Credentials" }).status(500);
    return
  }
  api.Login(username, password, (value, err) => {
    callback(res,value,err)
  })
})
router.post("/signup", (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (username == null || password == null ) {
    res.send({ success: false, error : "Missing Credentials" }).status(500);
    return
  }
  api.Signup(username, password, (value, err) => {
    callback(res,value,err)
  })
})

router.post("/token/verify", (req, res) => {
  authorize(res, req, () => {
    res.send({success : true}).status(200);
  })
})

// API EndPoint
router.post("/testPost", (req, res) => {
  authorize(res, req, () => {
    res.send({response : "okay"}).status(200);
  })
})

module.exports = router;

