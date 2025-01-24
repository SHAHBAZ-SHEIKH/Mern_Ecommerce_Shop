import React from 'react';
import styled from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Navbar from './Navbar';
import Footer from './Footer';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background="linear-gradient(135deg, #f44336, #e57373)"
  color: #fff;
  font-family: 'Arial', sans-serif;
`;

const IconWrapper = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 10px 0;
  text-align: center;
`;

const Message = styled.p`
  font-size: 1rem;
  margin: 10px 0;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 1rem;
  font-weight: bold;
  color: #f44336;
  background-color: #ffebee;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background-color: #e8f5e9;
  }
`;

const Cancel = () => {
    const handleRetry = () => {
      // Redirect to retry or payment page
      window.location.href = '/cart';
    };
  return (
    
    <>
    <Navbar/>
    <CardWrapper>
      <IconWrapper>
        <CheckCircleIcon style={{ fontSize: '80px', color: '#fff' }} />
      </IconWrapper>
      <Title>Payment Cancelled</Title>
      <Message>Your payment was not successful. Please try again.</Message>
      <Button onClick={handleRetry}>Retry Payment</Button>
    </CardWrapper>
    <Footer />

    </>
  );
};

export default Cancel;
