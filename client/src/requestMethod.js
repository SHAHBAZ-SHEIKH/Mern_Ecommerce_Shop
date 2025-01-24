import axios from "axios";

const BASE_URL = "http://localhost:4000/api/";
// const TOKEN =
//   JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser
//     .accessToken || "";

// const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
// const currentUser = user && JSON.parse(user).currentUser;
// const TOKEN = currentUser?.accessToken;
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsiX2lkIjoiNjc4ZGVkMWQ4YzFlY2E4ZmMyOGQyM2EzIiwiZmlyc3ROYW1lIjoiU2hhaGJheiIsImxhc3ROYW1lIjoiQWhtZWQiLCJ1c2VyTmFtZSI6IlNoYWhiYXoxMjM0IiwiZW1haWwiOiJhc2hhYmF6ODQ1QGdtYWlsLmNvbSIsImlzVmVyaWZpZWQiOmZhbHNlLCJpc0FkbWluIjp0cnVlLCJvdHAiOiJkNDU3NGMiLCJleHBpcmVzSW4iOiIyMDI1LTAxLTIwVDA2OjMzOjQ1LjM4NVoiLCJjcmVhdGVkQXQiOiIyMDI1LTAxLTIwVDA2OjI4OjQ1LjQxMloiLCJ1cGRhdGVkQXQiOiIyMDI1LTAxLTIwVDA2OjI4OjQ1LjQxMloiLCJfX3YiOjB9LCJpYXQiOjE3Mzc1MjcxNzV9.522xSZHZ00OnCGAVxhv-qDzPST3L4i5dtGMP2sqySZE"

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { authorization: `Bearer ${TOKEN}` },
});
