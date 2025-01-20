import React, { useState, useEffect } from 'react';
import './Orders.css';
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("An error occurred while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value
      });
      if (response.data.success) {
        await fetchAllOrders();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("An error occurred while updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className='order-item'>
            <img src={assets.parcel_icon || "default_icon.png"} alt="Parcel Icon" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) =>
                  `${item.name} x ${item.quantity}${index === order.items.length - 1 ? "" : ", "}`
                ).join("")}
              </p>
              <p className='order-item-name'>{order.address.name}</p>
              <div>
                <p>{order.address.address}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>Rp.{order.amount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Pesanan Di Proses">Pesanan Di Proses</option>
              <option value="Dalam Perjalanan">Dalam Perjalanan</option>
              <option value="Pesanan Terkirim">Pesanan Terkirim</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

Orders.defaultProps = {
  url: "",
};

export default Orders;
