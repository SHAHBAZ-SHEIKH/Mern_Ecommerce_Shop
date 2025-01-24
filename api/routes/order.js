import express from "express";
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from "../helpers/token.js";
import Order from "../models/Order.js";


const orderRouter = express.Router();

//CREATE

orderRouter.post("/",verifyTokenAndAuthorization, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).send(savedOrder);
    } catch (error) {
        res.status(500).send(error);
        
    }
})



// Update

orderRouter.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{$set: req.body},{new:true});
        res.status(200).send(updatedOrder);
    } catch (error) {
        res.status(500).send(error);
        
    }
})


// DeleteOrder
orderRouter.delete("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).send("Order has been deleted");
    } catch (error) {
        res.status(500).send(error);
        
    }
})


// Get User Order

orderRouter.get("/find/:userId",verifyTokenAndAuthorization,async (req, res) => {
    try {
        const getOrder = await Order.find({userId: req.params.userId});
        res.status(200).send(getOrder);
    } catch (error) {
        res.status(500).send(error);
        
    }

})


// Get All Order

orderRouter.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try {
        const getAllOrders = await Order.find();
        res.status(200).json(getAllOrders);
    } catch (error) {
        res.status(500).send(error);
        
    }
})


// Get Income

// GET MONTHLY INCOME

orderRouter.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1)); // Start of last month

  try {
    const income = await Order.aggregate([
      // Match orders created after 'lastMonth'
      { $match: { createdAt: { $gte: lastMonth } } },
      // Sum all amounts
      {
        $group: {
          _id: null, // No grouping by month, calculate total directly
          totalIncome: { $sum: "$amount" },
        },
      },
    ]);

    // Check if income exists, otherwise return 0
    const totalIncome = income.length > 0 ? income[0].totalIncome : 0;

    res.status(200).json({ totalIncome });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: "Failed to calculate total income" });
  }
});


export default orderRouter;

