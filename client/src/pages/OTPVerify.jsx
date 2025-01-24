import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f3f4f6;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  margin-bottom: 1.5rem;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 1.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  outline: none;
  transition: box-shadow 0.2s ease-in-out;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #2563eb;
  color: #ffffff;
  font-weight: 600;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #1e3a8a;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  }
`;

const ResendLink = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #1e3a8a;
  }

  &:focus {
    outline: none;
  }
`;

const OTPVerify = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const userName = useSelector((state)=>state.user.currentUser)
  console.log(userName)

  const handleChange = (element, index) => {
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      newOtp[i] = char;
      if (i < 5) {
        inputRefs.current[i + 1].focus();
      }
    });
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    console.log('Entered OTP:', enteredOtp);
    try {
      const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)?.currentUser?.token;
            console.log("Token",TOKEN)

      const response = await axios.post(
        'http://localhost:4000/api/auth/verifyEmail',{otp: enteredOtp},{
            headers: {
              authorization: `Bearer ${TOKEN}`,
            },
          });
      toast.success(response.data.message);
      setTimeout(()=>{navigate("/")},2000)

      console.log(response.data);
    } catch (error) {
      console.error(error.response?.data?.message);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <Container>
      <ToastContainer  />
      <Card>
        <Title>Enter your Verification Code!</Title>
        <Description>
          Enter the 6-character code that we sent to <strong>{userName.email}</strong>
        </Description>
        <form onSubmit={handleSubmit}>
          <InputWrapper onPaste={handlePaste}>
            {otp.map((data, index) => (
              <Input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </InputWrapper>
          <Button type="submit">Verify</Button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          Didn't receive anything?{' '}
          <ResendLink
            type="button"
            onClick={() => alert('Resend code functionality here')}
          >
            Resend Code
          </ResendLink>
        </p>
      </Card>
    </Container>
  );
};

export default OTPVerify;
