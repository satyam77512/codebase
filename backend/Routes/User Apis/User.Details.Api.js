const express = require("express");
const router = express.Router();

const {getDetails,filterUser,viewProfile,Update,ToggleStatus,changeProfile,changeResume,activeUsers}  = require('../../Controller/User/Details.Controllers')

router.post("/getDetails",getDetails);
router.post("/filter",filterUser);
router.post("/viewProfile",viewProfile);
router.put("/update",Update);
router.put("/status",ToggleStatus);
router.put("/changeProfile",changeProfile)
router.put("/changeResume",changeResume);
router.post("/activeUsers",activeUsers);


module.exports = router;
