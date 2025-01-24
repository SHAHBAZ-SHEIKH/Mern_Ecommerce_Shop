import "./userList.css";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUsersFailure, getUsersSuccess ,deleteUsersFailure,deleteUsersSuccess} from "../../redux/userRedux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserList() {
  const [data, setData] = useState([]); // Initialize data state
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get the token from local storage
        const TOKEN = JSON.parse(
          JSON.parse(localStorage.getItem("persist:root")).user
        )?.currentUser?.token;

        // Fetch users from the backend
        const res = await axios.get("http://localhost:4000/api/user", {
          headers: {
            authorization: `Bearer ${TOKEN}`,
          },
        });

        // Update Redux store and local state
        dispatch(getUsersSuccess(res.data));
        
        setData(res.data);
      } catch (err) {
        dispatch(getUsersFailure());
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      // Delete user from the backend
      const TOKEN = JSON.parse(
        JSON.parse(localStorage.getItem("persist:root")).user
      )?.currentUser?.token;

      await axios.delete(`http://localhost:4000/api/user/${id}`, {
        headers: {
          authorization: `Bearer ${TOKEN}`,
        },
      });
      dispatch(deleteUsersSuccess(id));

      // Update local state after deletion
      setData(data.filter((item) => item._id !== id));

      toast.success("User deleted successfully");
    } catch (err) {
      dispatch(deleteUsersFailure());
      console.error("Error deleting user:", err);
      toast.error("Error deleting user");
    }
  };

  // Define the columns for the DataGrid
  const columns = [
    { field: "_id", headerName: "ID", width: 150 },
    {
      field: "userName",
      headerName: "User Name",
      width: 200,
    },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "isVerified",
      headerName: "Verified",
      width: 150,
      renderCell: (params) => (
        <span
          style={{
            color: params.row.isVerified ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {params.row.isVerified ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user/" + params.row._id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <ToastContainer />
      <DataGrid
        rows={data}
        getRowId={(row) => row._id} // Use _id as the unique identifier
        columns={columns}
        pageSize={8}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}
