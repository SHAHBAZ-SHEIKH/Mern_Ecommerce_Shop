import express from "express";
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from "../helpers/token.js";
import Users  from "../models/Users.js";


const userRouter = express.Router();

// userRouter.put("/:id",verifyTokenAndAuthorization, (req, res) => {
//     if(req.body.password){

//     }
// });


// @desc    Get user
// @route   POST api/user/:id
// @access  Private

userRouter.get("/find/:id",verifyTokenAndAdmin,async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
        
    }

})


// @desc    Get All user
// @route   POST api/user/
// @access  Private

//GET ALL USER
userRouter.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await Users.find().sort({ _id: -1 }).limit(5)
        : await Users.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });


userRouter.put("/update/:id",verifyTokenAndAdmin,async (req,res)=>{
    console.log(req.body);  
    try {
        const updatedUser = await Users.findByIdAndUpdate(req.params.id,{$set: req.body},{new:true});
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(500).send(error);
        
    }
})

// @desc    Get Delete user
// @route   POST api/user/
// @access  Private

userRouter.delete("/:id",verifyTokenAndAdmin,async (req, res) => {
    try {
        await Users.findByIdAndDelete(req.params.id);
        res.status(200).send("User has Been Delete");
    } catch (error) {
        res.status(500).send(error);
        
    }

})


// GET USER STATS

userRouter.get("/userStats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    console.log("lastYear", lastYear);

    try {
        const data = await Users.aggregate([
            // Match users created within the last year
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" }, // Extract the month from the createdAt field
                },
            },
            {
                $group: {
                    _id: "$month", // Group by the extracted month
                    total: { $sum: 1 }, // Count the number of users per month
                },
            },
        ]);

        console.log("data", data);
        res.status(200).send(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: error.message });
    }
});


export default userRouter


