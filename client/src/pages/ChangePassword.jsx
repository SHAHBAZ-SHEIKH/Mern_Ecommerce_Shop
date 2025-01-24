import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  padding: 1rem;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  text-align: center;
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  font-size: 1rem;
  color: #374151;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #3b82f6;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;

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
  margin-top: -0.75rem;
`;

const SuccessMessage = styled.p`
  font-size: 0.875rem;
  color: #10b981;
  text-align: center;
`;

const BackLink = styled(Link)`
  font-size: 1rem;
  color: #3b82f6;
  text-align: center;
  margin-top: 1.5rem;
  display: block;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ChangePassword = () => {
  const [confirmNewPassword, setconfirmNewPassword] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    console.log("CHal raha hai")
    e.preventDefault();
    console.log("newPassword",newPassword,"confirmNewPassword",confirmNewPassword)
    setError('');
    setSuccess(false);
    if(newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      

      const token = localStorage.getItem('Usertoken');
      const res = await axios.put('http://localhost:4000/api/auth/resetPassword', { newPassword, confirmNewPassword, token } )
      toast.success(res.data.message);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      },2000)
      console.log("res.data", res.data)
    } catch (error) {
      setError(error.response);
      console.log(error);
      toast.error(error.response?.data?.message);
      
    }

    

    

    // Simulate password change logic (e.g., API call)
    
  };

  return (
    <Container>
    <ToastContainer />
      <FormWrapper>
        <Title>Change Password</Title>
        <Subtitle>Enter a new password below to change your password.</Subtitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="password">New Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setnewPassword(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              type="password"
              id="confirm-password"
              placeholder="Confirm your new password"
              value={confirmNewPassword}
              onChange={(e) => setconfirmNewPassword(e.target.value)}
              required
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>Password changed successfully!</SuccessMessage>}

          <Button type="submit">Change Password</Button>
        </Form>
        <BackLink to="/login">Back to Login</BackLink>
      </FormWrapper>
    </Container>
  );
};

export default ChangePassword;
