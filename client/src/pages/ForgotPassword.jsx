import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    console.log("chal raha hai")
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/forgotpassword",
        { email },
        { withCredentials: true }
      );
      console.log(res);
      setSuccessMessage(
        "Password reset link sent successfully. Please check your email."
      );
      setErrorMessage("");
      setEmail("");
      toast.success(
        "Password reset link sent successfully. Please check your email."
      );
      console.log("res", res);
      setTimeout(() => {
        navigate("/verify-email");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred.");
      setSuccessMessage("");
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <Container>
      <Card>
        <Title>Forgot Password</Title>
        <Description>
          Please provide the email address you use to sign in. If we find an
          associated account, we will send you instructions to reset your
          password.
        </Description>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

          <Button type="submit">Send Email</Button>
        </form>

        <FooterText>
          Remembered your password?{" "}
          <FooterLink to="/login">Login</FooterLink>
        </FooterText>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default ForgotPassword;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f4f6;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  font-size: 0.875rem;
  text-align: center;
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #3b82f6;
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.875rem;
  color: #ef4444;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.p`
  font-size: 0.875rem;
  color: #10b981;
  margin-bottom: 1rem;
`;

const FooterText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-top: 1.5rem;
`;

const FooterLink = styled(Link)`
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;
