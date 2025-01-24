import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import {Publish} from "@mui/icons-material";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import axios from "axios";
import { updateProductStart, updateProductSuccess, updateProductFailure } from "../../redux/productRedux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Product() {
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const [productItem, setProduct] = useState({});
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );

  useEffect(() => {
    setProduct(product);
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...productItem, [name]: value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateProductStart());

    const updateData = async () => {
      let imgUrl = product.img; // Default to the existing image URL
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

      const updatedProduct = {
        ...productItem,
        img: imgUrl, // Use the updated or existing image URL
        categories: categories || product.categories, // Use the updated or existing categories
      };

      console.log("updatedProduct", updatedProduct);

      try {
        const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)?.currentUser?.token;

        const res = await axios.put(
          `http://localhost:4000/api/product/${product._id}`,
          updatedProduct,
          {
            headers: {
              authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        console.log("Product updated successfully:", res.data);
        dispatch(updateProductSuccess(res.data));
        toast.success("Product updated successfully");
        setTimeout(()=>{
            navigate("/products")
        },4000)
      } catch (err) {
        console.error("Product update failed:", err);
        dispatch(updateProductFailure());
        toast.error(err.response.data.message);
      }
    };

    updateData();
  };

  return (
    <div className="product">
      <ToastContainer />
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={[]} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product.img} alt="" className="productInfoImg" />
            <span className="productName">{product.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">ID:</span>
              <span className="productInfoValue">{product._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Sales:</span>
              <span className="productInfoValue">5123</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">In Stock:</span>
              <span className="productInfoValue">{product.inStock}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm" onSubmit={handleUpdate}>
          <div className="productFormLeft">
            <label>Product Name</label>
            <input
              type="text"
              name="title"
              placeholder={product.title}
              value={productItem.title || ""}
              onChange={handleInputChange}
            />
            <label>Product Description</label>
            <input
              type="text"
              name="desc"
              placeholder={product.desc}
              value={productItem.desc || ""}
              onChange={handleInputChange}
            />
            <label>Price</label>
            <input
              type="text"
              name="price"
              placeholder={product.price}
              value={productItem.price || ""}
              onChange={handleInputChange}
            />
            <label>Categories</label>
            <input
              type="text"
              name="categories"
              placeholder={product.categories?.join(", ")}
              onChange={(e) => setCategories(e.target.value.split(", "))}
            />
            <label>In Stock</label>
            <select
              name="inStock"
              id="idStock"
              value={productItem.inStock}
              onChange={handleInputChange}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img src={product.img} alt="" className="productUploadImg" />
              <label htmlFor="file">
                <Publish />
              </label>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <button onClick={handleUpdate} type="submit" className="productButton">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
