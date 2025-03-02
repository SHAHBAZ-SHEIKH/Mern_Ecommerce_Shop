import { useEffect, useState } from "react";
// import { userRequest } from "../../requestMethods";
import "./widgetLg.css";
import {format} from "timeago.js"
import axios from "axios"

export default function WidgetLg() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {

        const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)?.currentUser?.token;
      console.log("Token",TOKEN)


        const res = await axios.get("http://localhost:4000/api/orders",{
          headers: {
            authorization: `Bearer ${TOKEN}`,
          },
        });
        console.log("res.data", res.data);
        setOrders(res.data);
      } catch {}
    };
    getOrders();
  }, []);
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };
  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest transactions</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Customer</th>
          <th className="widgetLgTh">Date</th>
          <th className="widgetLgTh">Amount</th>
          <th className="widgetLgTh">Status</th>
        </tr>
        {orders.map((order) => (
          <tr className="widgetLgTr" key={order._id}>
            <td className="widgetLgUser">
              <span className="widgetLgName">{order.userId}</span>
            </td>
            <td className="widgetLgDate">{format(order.createdAt)}</td>
            <td className="widgetLgAmount">${order.amount}</td>
            <td className="widgetLgStatus">
              <Button type={order.status} />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
