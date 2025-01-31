const express = require("express");
const router = express.Router();

const {registerHandler,loginHandler}  = require('../../Controller/User/Credentials.Controller.js')

router.post("/register",registerHandler);
router.post("/login",loginHandler);

module.exports = router;
