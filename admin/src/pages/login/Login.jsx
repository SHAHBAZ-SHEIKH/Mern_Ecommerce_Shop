import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "../../redux/userRedux";
import { useNavigate } from "react-router-dom";

const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8e44ad, #3498db);
`;

const Title = styled.h2`
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 15px;
  width: 300px;
  margin-bottom: 15px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 15px;
  width: 320px;
  border: none;
  border-radius: 5px;
  background-color: #2ecc71;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #27ae60;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch(loginStart()); // Dispatch login start

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });
      console.log(res.data);

      if (res.data.data.isAdmin) {
        // Check if the user is an admin
        toast.success("Login Successful!", { position: "top-center" });
        localStorage.setItem("token", res.data.token); // Save token
        dispatch(loginSuccess(res.data)); // Update Redux state
        setTimeout(() => {
          navigate("/"); // Navigate to home
        }, 1000);
        return
      } else {
        toast.error("You are not authorized to access the admin panel!", {
          position: "top-center",
        });
        dispatch(loginFailure());
        return
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch(loginFailure());
      toast.error("Invalid credentials. Please try again!", {
        position: "top-center",
      });
    }
  };

  return (
    <LoginContainer>
      <ToastContainer />
      <Title>Login to Your Account</Title>
      <Input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleClick} disabled={!email || !password}>
        Login
      </Button>
    </LoginContainer>
  );
};

export default Login;
