import React, { useState } from "react";

import { useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";


const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f4f6;
`;

const Card = styled.div`
  width: 100%;
  max-width: 32rem;
  background: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const Text = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: ${(props) => (props.mb ? props.mb : "0")};
`;

const Email = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2563eb;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.4);
  }
`;

const ForgotPasswordSentPage = () => {

  const user = useSelector((state) => state.user?.currentUser.data);
  const email = user?.email;
  console.log("email",email)
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/forgotpassword",
        { email },
        { withCredentials: true }
      );
      console.log(res.data);
      
      
      toast.success(res.data.message);
      console.log("res", res);
      setTimeout(() => {
        navigate("/verify-email");
      }, 2000);
    } catch (error) {
      console.log("error",error)
      
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };
  return (
    <Container>
      <ToastContainer />
      <Card>
        <Title>We have sent a verification to your email.</Title>

        <Text mb="1rem">Please check your inbox, including the spam folder.</Text>

        <Text mb="1.5rem">
          Email Address: <Email>{email|| "ashabaz845@gmail.com" }</Email>
        </Text>

        <Text mb="1.5rem">
          If you don't see the email, you can resend the verification email.
        </Text>

        <Button onClick={handleSubmit}>Resend Verification Email</Button>
      </Card>
    </Container>
  );
};

export default ForgotPasswordSentPage;
