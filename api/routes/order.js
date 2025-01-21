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
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });
export default orderRouter;

