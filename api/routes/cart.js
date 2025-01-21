import express from "express";
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from "../helpers/token.js";
import Cart from "../models/Cart.js";


const cartRouter = express.Router();

//CREATE

cartRouter.post("/",verifyTokenAndAuthorization, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).send(savedCart);
    } catch (error) {
        res.status(500).send(error);
        
    }
})



// Update

cartRouter.put("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{$set: req.body},{new:true});
        res.status(200).send(updatedCart);
    } catch (error) {
        res.status(500).send(error);
        
    }
})


// DeleteCart
cartRouter.delete("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).send("Cart has been deleted");
    } catch (error) {
        res.status(500).send(error);
        
    }
})


// Get User Cart

cartRouter.get("/find/:userId",verifyTokenAndAuthorization,async (req, res) => {
    try {
        const getCart = await Cart.findOne({userId: req.params.userId});
        res.status(200).send(getCart);
    } catch (error) {
        res.status(500).send(error);
        
    }

})


// Get All Cart

cartRouter.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try {
        const getAllCart = await Cart.find();
        res.status(200).json(getAllCart);
    } catch (error) {
        res.status(500).send(error);
        
    }
})


export default cartRouter;

