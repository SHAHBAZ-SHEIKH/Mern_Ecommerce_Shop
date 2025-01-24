import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/userRedux';
import styled from 'styled-components';

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
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: medium;
  color: #4b5563;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  font-size: 0.875rem;
  font-weight: semibold;
  border: none;
  border-radius: 0.375rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #2563eb;
  }
  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const LinkText = styled.div`
  text-align: right;
  font-size: 0.875rem;
  a {
    color: #3b82f6;
    &:hover {
      color: #2563eb;
    }
  }
`;

const FooterText = styled.div`
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  a {
    color: #3b82f6;
    &:hover {
      color: #2563eb;
    }
  }
`;

const Spinner = styled.svg`
  animation: spin 1s linear infinite;
  height: 1.25rem;
  width: 1.25rem;
  color: white;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { loading } = useSelector((state) => state.user); // Access loading state
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    console.log('submit');
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in both fields.');
      return;
    }

    dispatch(loginStart()); // Set loading to true
    try {
      const response = await axios.post(
        'http://localhost:4000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem('Usertoken', (response.data.token));

      toast.success(response.data.message);
      setTimeout(() => {
        dispatch(loginSuccess(response.data)); // Set user data
        navigate("/")
      },5000)
       // Display success message
      setEmail('');
      setPassword('');
    } catch (error) {
      console.log(error)
      dispatch(loginFailure()); // Set error state
      setErrorMessage(error.response?.data?.message);
      toast.error(error.response?.data?.message); // Display error message
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Card>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? (
              <Spinner
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C6.477 0 0 6.477 0 12h4zm2 5.291a7.962 7.962 0 01-2-5.291H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </Spinner>
            ) : (
              'Login'
            )}
          </Button>

          <LinkText>
            <Link to="/forgot-password">Forgot Password?</Link>
          </LinkText>
        </Form>

        <FooterText>
          Don't have an account?{' '}
          <Link to="/register">Sign up</Link>
        </FooterText>
      </Card>
    </Container>
  );
};

export default Login;
