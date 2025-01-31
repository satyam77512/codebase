const UserCredentials = require('../../Models/User/User.credentials.js');
const UserDetails = require('../../Models/User/User.details.js');
const upload = require('../../Middlewares/multer.js'); // Multer setup

// Define the fields for multer
const uploadMiddleware = upload.fields([
    { name: 'ProfilePic', maxCount: 1 }, // Single profile picture
    { name: 'Resume', maxCount: 1 }     // Single resume
]);
const registerHandler = async (req, res) => {
    // Wrap multer in the function
    console.log("request recived")
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            // Handle multer errors
            console.log(err);
            return res.status(400).send({ message: 'File upload error', error: err.message });
        }

        try {
            // Extract form data from req.body
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
                Password
            } = req.body;
            // Check if the user already exists
            // console.log(FirstName)
            const user = await UserDetails.findOne({ RollNumber });
            if (user) {
                console.log("user exist");
                return res.status(500).send("This email is already registered");
            }
            
            // Extract uploaded file paths from req.files
            const ProfilePic = req.files?.ProfilePic ? req.files.ProfilePic[0].path : null;
            // if req.files is not null and req.files.files.ProfilePic is not null ,then take req.files.profilePic[0].path
            const Resume = req.files?.Resume ? req.files.Resume[0].path : null;
            // Create user details

            let createdUser = await UserDetails.create({
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
                ProfilePic, // Save the profile picture path
                Resume      // Save the resume path
            });

            // console.log('User details:', createdUser);

            // Create user credentials
            const createdCredentials = await UserCredentials.create({
                Loginid: RollNumber, // Generate Loginid dynamically
                Password
            });
            // console.log('User credentials:', createdCredentials);
            const data = createdUser;
            return res.json(data);

        } catch (error) {
            console.log('Error during registration:', error);
            return res.status(500).send("An error occurred while registering the user");
        }
    });
};

const loginHandler = async(req,res)=>{

    const {Loginid,Password} = req.body;

    const user = await UserCredentials.findOne({Loginid});
    if(!user)
    {
        console.log("user not exist");
        return res
            .status(400)
            .json({ success: false, message: "User not exist" });
    }
    else
    {
        if(user.Password == Password)
        {
           const data = await UserDetails.findOne({RollNumber:Loginid})
           return res.json(data);
        }
        else
        {
            console.log("incorrect password");
            return res
            .status(400)
            .json({ success: false, message: "Wrong Password" });
        }
    }
};

module.exports = { registerHandler,loginHandler };
