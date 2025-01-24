import styled from "styled-components";
import { mobile } from "../responsive";
import axios from "axios"
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { signupSuccess, signupFailure } from "../redux/userRedux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
`;

const Register = () => {

  const [formData, setFormData] = useState({
    userName:"",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cPassword: "",
  });
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log(formData)

    try {
      const userData = await axios.post("http://localhost:4000/api/auth/signup",formData);
      dispatch(signupSuccess(userData.data))
      toast.success(userData.data.message);
      localStorage.setItem('Usertoken', userData.data.token);
      setTimeout(()=>{
        navigate("/otp-verification")
      },2000)

      console.log("userData",userData.data);
    } catch (error) {
      console.log("error",error);
      dispatch(signupFailure())
      toast.error(error.response?.data?.message);
      
    }
  }


  return (
    <Container>
      <ToastContainer  />
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form>
          <Input onChange={handleChange} name="firstName"  value={formData.firstName} placeholder="name" />
          <Input onChange={handleChange}  name="lastName" value={formData.lastName} placeholder="last name" />
          <Input onChange={handleChange} name="userName" value={formData.userName} placeholder="username" />
          <Input onChange={handleChange} name="email" value={formData.email} placeholder="email" />
          <Input type="password" onChange={handleChange} name="password" value={formData.password} placeholder="password" />
          <Input type="password" onChange={handleChange} name="cPassword" value={formData.cPassword} placeholder="confirm password" />
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Button onClick={handleSubmit}>CREATE</Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
