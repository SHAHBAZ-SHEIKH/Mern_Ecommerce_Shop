import { Add, Key, Remove } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { mobile } from "../responsive";
import StripeCheckout from "react-stripe-checkout";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethod.js";
import { useNavigate } from "react-router-dom";
import {loadStripe} from '@stripe/stripe-js';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {clearCart} from "../redux/cartRedux"

//const KEY = import.meta.env.VITE_STRIPE_KEY;
// const STRIP_KEY = "pk_test_51QjPDsKvAjGuhZAarI4WG5mElQOX3NQqb4VnLj7BL6uOPxOZNUXX1nFgVjkJnLJmvuwWjjm0oiNUVyJUgwXs3j3P00ggdUsZEh"

//console.log("KEY",KEY)


const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
`;

const TopTexts = styled.div`
  ${mobile({ display: "none" })}
`;
const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductId = styled.span``;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user?.currentUser?.data);
  
  const [stripeToken, setStripeToken] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  console.log("cart", cart);
  console.log("user", user);  

  // const onToken = async (token) => {
  //   console.log("Token",token)
  //   setStripeToken(token);
  // };



  //console.log("stripeToken",stripeToken)
  const makePayment = async () => {
    try {
      // Initialize Stripe
      const stripe = await loadStripe('pk_test_51QjPDsKvAjGuhZAarI4WG5mElQOX3NQqb4VnLj7BL6uOPxOZNUXX1nFgVjkJnLJmvuwWjjm0oiNUVyJUgwXs3j3P00ggdUsZEh');
  
      // Create a checkout session (existing code for Stripe)
      const productItem = {
        products: cart.products,
      };
  
      const headers = {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('Usertoken')}` // Include token
      };
  
      const res = await axios.post('http://localhost:4000/api/create-checkout-session', productItem, { headers });
      const session = res.data;
      
      // Send the order to the backend
      const orderData = {
        userId: user._id, // Replace this with the actual userId dynamically if needed
        products: cart.products.map((product) => ({
          productId: product._id,
          quantity: product.quantity,
        })),
        amount: cart.total,
        address: "Karachi", // Replace with actual address dynamically if needed
      };
  
      const response = await axios.post('http://localhost:4000/api/orders', orderData, { headers });
      //  // Add token in headers
      console.log("response", response.data);
      dispatch(clearCart())
  
      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      
      if (result.error) {
        console.error(result.error.message);
        toast.error(result.error.message);
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      toast.error(error.message);
    }
  };
  

  

  // useEffect(() => {
  //   const makeRequest = async () => {
  //     try {
  //       console.log("Request data:", {
  //         tokenId: stripeToken.id,
  //         amount: cart.total * 100,
  //       });
  //       const res = await userRequest.post("/checkout/payment", {
  //         tokenId: stripeToken.id,
  //         amount: 500,
  //       });
  //       navigate("/success", {
  //         stripeData: res.data,
  //         products: cart, });
  //     } catch(err){
  //       console.log(err)
  //     }
  //   };
  //   stripeToken && makeRequest();
  // }, [stripeToken, cart.total, navigate]);


  return (
    <Container>
      <ToastContainer />
      <Navbar />
      <Announcement />
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <TopButton>CONTINUE SHOPPING</TopButton>
          <TopTexts>
            <TopText>Shopping Bag(2)</TopText>
            <TopText>Your Wishlist (0)</TopText>
          </TopTexts>
          <TopButton type="filled">CHECKOUT NOW</TopButton>
        </Top>
        <Bottom>
          <Info>
            {cart.products.map((product) => (
              <Product key={product._id}>
                <ProductDetail>
                  <Image src={product.img} />
                  <Details>
                    <ProductName>
                      <b>Product:</b> {product.title}
                    </ProductName>
                    <ProductId>
                      <b>ID:</b> {product._id}
                    </ProductId>
                    <ProductColor color={product.color} />
                    <ProductSize>
                      <b>Size:</b> {product.size}
                    </ProductSize>
                  </Details>
                </ProductDetail>
                <PriceDetail>
                  <ProductAmountContainer>
                    <Add />
                    <ProductAmount>{product.quantity}</ProductAmount>
                    <Remove />
                  </ProductAmountContainer>
                  <ProductPrice>
                    $ {product.price * product.quantity}
                  </ProductPrice>
                </PriceDetail>
              </Product>
            ))}
            <Hr />
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>$ 5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>$ -5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            
              <Button onClick={makePayment}>CHECKOUT NOW</Button>
            
          </Summary>
        </Bottom>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Cart;
