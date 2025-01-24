import {
    CalendarToday,
    LocationSearching,
    MailOutline,
    PermIdentity,
    PhoneAndroid,
    Publish,
  } from "@mui/icons-material";
  import { Link, useParams } from "react-router-dom";
  import "./user.css";
import { useSelector } from "react-redux";
  import { useState, useEffect } from "react";
  import { useDispatch } from "react-redux";
  import { updateUsersStart, updateUsersSuccess, updateUsersFailure} from "../../redux/userRedux";
  import axios from "axios";
  import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";
  import app from "../../firebase";
  import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
  
  export default function User() {

    const {userId} = useParams()
    const user = useSelector((state)=>state.user.users)
    const currentUser = user.find((u)=>u._id===userId)
    // console.log("currentUser",currentUser)
    const [inputs, setInputs] = useState({});
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
      if (currentUser) {
        setInputs(currentUser);
      }
    }, [currentUser]);
    // const TOKEN = JSON.parse(
    //   JSON.parse(localStorage.getItem("persist:root")).user
    // )?.currentUser?.token;

    // console.log("Token", TOKEN);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      console.log(name, value);
    setInputs({ ...inputs, [name]: value });
    };
    
    const handleUpdate = (e)=>{
      e.preventDefault();
      const updateUser = async (id) => {
      
        let imgUrl = currentUser.img || "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"; 
        // // Default to the existing image URL
  
        if (file) {
          const fileName = new Date().getTime() + file.name;
          const storage = getStorage(app);
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);
  
          await new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
              },
              (error) => {
                console.error("Image upload failed:", error);
                reject(error);
              },
              async () => {
                imgUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve();
              }
            );
          });
        }
  
        const updateUser = {
          ...inputs,
          img: imgUrl,
        }
        try {
          // Delete user from the backend
          const TOKEN = JSON.parse(
            JSON.parse(localStorage.getItem("persist:root")).user
          )?.currentUser?.token;

          console.log("Token", TOKEN);
    
          const res = await axios.put(`http://localhost:4000/api/user/update/${userId}`, updateUser,
            {
              headers: {
                authorization: `Bearer ${TOKEN}`,
              },
            }
          );
          dispatch(updateUsersSuccess(userId));
          console.log("res.data", res.data);
          toast.success(res.data.message);
          
    
          // Update local state after deletion
          
        } catch (err) {
          dispatch(updateUsersFailure());
          console.error("Error Updating user:", err);
          toast.error("Error Updating user");
        }
      };
      updateUser()

    }

    

    

    return (
      <div className="user">
        <ToastContainer />
        <div className="userTitleContainer">
          <h1 className="userTitle">Edit User</h1>
          <Link to="/newUser">
            <button className="userAddButton">Create</button>
          </Link>
        </div>
        <div className="userContainer">
          <div className="userShow">
            <div className="userShowTop">
              <img
                src={inputs.img || "https://i.ibb.co/mbf2tLr/user.png"}
                alt=""
                className="userShowImg"
              />
              <div className="userShowTopTitle">
                <span className="userShowUsername">{inputs.firstName || currentUser.firstName}</span>
                <span className="userShowUserTitle">Software Engineer</span>
              </div>
            </div>
            <div className="userShowBottom">
              <span className="userShowTitle">Account Details</span>
              <div className="userShowInfo">
                <PermIdentity className="userShowIcon" />
                <span className="userShowInfoTitle">{inputs.userName || currentUser.userName}</span>
              </div>
              <div className="userShowInfo">
                <CalendarToday className="userShowIcon" />
                <span className="userShowInfoTitle">10.12.1999</span>
              </div>
              <span className="userShowTitle">Contact Details</span>
              <div className="userShowInfo">
                <PhoneAndroid className="userShowIcon" />
                <span className="userShowInfoTitle">+1 123 456 67</span>
              </div>
              <div className="userShowInfo">
                <MailOutline className="userShowIcon" />
                <span className="userShowInfoTitle">{inputs.email || currentUser.email}</span>
              </div>
              <div className="userShowInfo">
                <LocationSearching className="userShowIcon" />
                <span className="userShowInfoTitle">{inputs.address || currentUser.address || "Karachi"}</span>
              </div>
            </div>
          </div>
          <div className="userUpdate">
            <span className="userUpdateTitle">Edit</span>
            <form className="userUpdateForm">
              <div className="userUpdateLeft">
                <div className="userUpdateItem">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="annabeck99"
                    className="userUpdateInput"
                    value={inputs.userName || ""}
                    onChange={handleChange}
                    name="userName"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Anna Becker"
                    className="userUpdateInput"
                    value={inputs.firstName + " " + inputs.lastName || ""}
                    onChange={handleChange}
                    name="firstName"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Email</label>
                  <input
                    type="text"
                    placeholder="annabeck99@gmail.com"
                    className="userUpdateInput"
                    name="email"
                    value={inputs.email || ""}
                    onChange={handleChange}
                    
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Phone</label>
                  <input
                    type="text"
                    placeholder="+1 123 456 67"
                    className="userUpdateInput"
                    value={inputs.phone || ""}
                    onChange={handleChange}
                    name="phone"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Address</label>
                  <input
                    type="text"
                    placeholder="New York | USA"
                    className="userUpdateInput"
                    value={inputs.address || ""}
                    onChange={handleChange}
                    name="address"
                  />
                </div>
              </div>
              <div className="userUpdateRight">
                <div className="userUpdateUpload">
                  <img
                    className="userUpdateImg"
                    src={inputs.img || "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                    alt=""
                  />
                  <label htmlFor="file">
                    <Publish className="userUpdateIcon" />
                  </label>
                  <input onChange={e => setFile(e.target.files[0])} type="file" id="file" style={{ display: "none" }} />
                </div>
                <button onClick={handleUpdate} className="userUpdateButton">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  