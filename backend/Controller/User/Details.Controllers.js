const UserCredentials = require('../../Models/User/User.credentials.js');
const UserDetails = require('../../Models/User/User.details.js');
const upload = require('../../Middlewares/multer.js'); // Multer setup
const path = require('path');
const fs = require("fs");

const uploadMiddleware1 = upload.fields([
    { name: 'imageFile', maxCount: 1 }, // Single profile picture
]);

const getDetails = async(req,res)=>{
    // console.log(req.body.Loginid)
    try{
        const {Loginid} = req.body;
        let user = await UserDetails.findOne({RollNumber:Loginid});
        if(!user)
        {
            console.log("user not found");
        }
        const data = {
            success: true,
            message: "Student Details Found!",
            user,
        }
        return res.status(200).json(data);
    }catch(err){
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const filterUser = async(req,res)=>{
    const {department , year, skills, gender} = req.body;
    // console.log(req.body);
    try{
        const query = {};

        if (department!="" && department!="All") {
            query.Department = department;
        }
        if (year!="" && year!="All") {
            query.Year = year;
        }
        if (gender!="" && gender!="All") {
            query.Gender = gender;
        }
        if (skills && skills.length > 0) {
            query.Skills = { $in: skills }; // Reference `skills` from request body
        }
        // Find users matching the query
        const users = await UserDetails.find(query);         
      
       
        return res.status(200).json(users);
    }catch(err){
        console.log(err);
    }

    // console.log(users);
}

const viewProfile = async(req,res)=>{
    try{
        const {RollNumber} = req.body;
        const user = await UserDetails.findOne({RollNumber});
        return res.status(200).json(user);
    }
    catch(err)
    {
        console.log(err);
    }
    
}

const Update = async(req,res)=>{
    try{
        const {
            FirstName,
            MiddleName,
            LastName,
            Email,
            Gender,
            Department,
            Year,
            RollNumber,
            Phone,
            Skills,
            Password,
        } = req.body;
        // console.log(req.body);
       const UpdatedUser = await UserDetails.updateOne({RollNumber},{
        $set: {
          FirstName,
          MiddleName,
          LastName,
          Email,
          Gender,
          Department,
          Year,
          RollNumber,
          Phone,
          Skills,
          Password
        },
      });
      const UpdatedCredentials = await UserCredentials.updateOne({Loginid:RollNumber},{
        $set: {
           Loginid:RollNumber,
           Password
          },
      })
       return res.status(200).json(req.body);
    }
    catch(err){
        console.log(err);
        return res.status(400);
    }
}
const ToggleStatus = async(req,res)=>{
    
    // console.log("req aya hai")
    const {RollNumber} = req.body;
    try {
        const user = await UserDetails.findOne({RollNumber});
        user.Status = !user.Status;
        await user.save();

        res.status(200).json(user.Status);
    } catch (error) {
        
    }
}

const changeProfile = async(req,res)=>{

    const {imageFile,RollNumber} = req.body;
    uploadMiddleware1(req, res, async (err) => {
        if (err) {
            // Handle multer errors
            console.log(err);
            return res.status(400).send({ message: 'File upload error', error: err.message });
        }
        const ProfilePic = req.files?.imageFile ? req.files.imageFile[0].path : null;

        const user = await UserDetails.findOne({RollNumber: req.body.RollNumber});
        // console.log(user)
        const oldPath = user.ProfilePic;
        user.ProfilePic = ProfilePic;
        await user.save();
        fs.unlink(oldPath,(err)=>{
            if(err)
            {
                console.log(err);
                res.status(400);
            }
            else
            {
                return res.status(200).json(ProfilePic);
            }
        })
        
    })
}

const changeResume = (req,res)=>{

    uploadMiddleware1(req, res, async (err) => {
        if (err) {
            // Handle multer errors
            console.log(err);
            return res.status(400).send({ message: 'File upload error', error: err.message });
        }
        const Resume = req.files?.imageFile ? req.files.imageFile[0].path : null;

        const user = await UserDetails.findOne({RollNumber: req.body.RollNumber});
        // console.log(user)
        const oldPath = user.Resume;
        user.Resume = Resume;
        await user.save();
        fs.unlink(oldPath,(err)=>{
            if(err)
            {
                console.log(err);
                res.status(400);
            }
            else
            {
                return res.status(200).json(Resume);
            }
        })
        
    })
}

const activeUsers = async(req,res)=>{
    const users = await UserDetails.find({Status : true});
    return res.status(200).json(users);
}

module.exports = {getDetails,filterUser,viewProfile,Update,ToggleStatus,changeProfile,changeResume,activeUsers};