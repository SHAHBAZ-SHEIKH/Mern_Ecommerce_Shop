import express from "express";
import { verifyTokenAndAdmin } from "../helpers/token.js";
import Product from "../models/Product.js";

const productRouter = express.Router();

//CREATE

productRouter.post("/",verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedproduct = await newProduct.save();
        res.status(200).send(savedproduct);
    } catch (error) {
        res.status(500).send(error);
        
    }
})


// UpdateProduct

productRouter.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{$set: req.body},{new:true});
        res.status(200).send(updatedProduct);
    } catch (error) {
        res.status(500).send(error);
        
    }
})


// DeleteProduct
productRouter.delete("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).send("Product has been deleted");
    } catch (error) {
        res.status(500).send(error);
        
    }
})

// Get Product

productRouter.get("/find/:id",async (req, res) => {
    try {
        const getproduct = await Product.findById(req.params.id);
        res.status(200).send(getproduct);
    } catch (error) {
        res.status(500).send(error);
        
    }

})


productRouter.get("/",async (req, res) => {

    const qNew = req.query.new;
    const queryCategory = req.query.category;
    try {

        let products;
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        }
        else if(queryCategory){
            products = await Product.find({
                categories: {
                    $in: [queryCategory],
                },
            });
        }
        else{
            products = await Product.find();
        }
        res.status(200).send(products);
        
    } catch (error) {
        res.status(500).send(error);
        
    }

})

export default productRouter;