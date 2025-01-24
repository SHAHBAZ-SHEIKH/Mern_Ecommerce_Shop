import "./productList.css";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { deleteProduct, getProducts } from "../../redux/apiCalls";
import { getProductSuccess,getProductFailure,deleteProductFailure,deleteProductStart,deleteProductSuccess, } from "../../redux/productRedux";
import axios from "axios"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  console.log("products", products);

  useEffect(() => {
    // Declare async function inside useEffect
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/product");
        console.log("res.data", res.data);
        dispatch(getProductSuccess(res.data));
      } catch (error) {
        dispatch(getProductFailure());
      }
    };

    fetchProducts(); // Call the async function immediately
  }, [dispatch]); 

  const handleDelete = async(id) => {
    console.log("id",id)
    dispatch(deleteProductStart());
    try {
      // Get the token from localStorage
      const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)?.currentUser?.token;
      // console.log("Token",TOKEN)


      // Make the delete request with the token in the headers

      const res = await axios.delete(`http://localhost:4000/api/product/${id}`, {
        headers: {
          authorization: `Bearer ${TOKEN}`,
        },
      });
      console.log("res.data", res.data);
      dispatch(deleteProductSuccess(id))
      toast.success(res.data);
    } catch (error) {
      console.log(error.message)
      dispatch(deleteProductFailure());
      toast.error(error.response.data);
    }
    // deleteProduct(id, dispatch);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "product",
      headerName: "Product",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.img} alt="" />
            {params.row.title}
          </div>
        );
      },
    },
    { field: "inStock", headerName: "Stock", width: 200 },
    {
      field: "price",
      headerName: "Price",
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/product/" + params.row._id}>
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="productList">
      <ToastContainer />
      <DataGrid
        rows={products}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
