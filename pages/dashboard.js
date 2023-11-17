// pages/dashboard.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Card, message, Select, Popconfirm } from "antd";
import ProtectedRoute from "../components/ProtectedRoute";
const { Option } = Select;

const DashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const responseDataFromOrderPage = router.query.responseData
    ? JSON.parse(router.query.responseData)
    : null;

  useEffect(() => {
    console.log("responseDataFromOrderPage", responseDataFromOrderPage?.id);
    if (responseDataFromOrderPage?.id) {
      fetchOrderById(responseDataFromOrderPage.id);
    }
  }, [router.query.responseData]);

  const fetchOrderById = async (orderId) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        const orderData = await response.json();
        console.log("Order Data:", orderData);
        setResponseData(orderData);
        message.success("Fetch order by ID successful!");
      } else {
        const errorMessage = await response.text();
        console.error("Fetch order by ID failed:", errorMessage);
        message.error(`Fetch order by ID failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during fetch order by ID:", error);
      message.error(`Error during fetch order by ID: ${error}`);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("accessToken");

        router.push("/login");
        message.success("Logout successful!");
      } else {
        // Handle logout error
        const errorMessage = await response.text();
        console.error("Logout failed:", errorMessage);
        message.error(`Logout failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      message.error(`Error during logout: ${error}`);
    }
    setLoading(false);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    console.log("Selected Status:", selectedStatus);
    console.log("responseData.id:", responseData.id);

    if (selectedStatus == null) {
      setLoading(false);
      message.error(`update order failed: selectedStatus cannot be null`);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/orders/${responseData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            status: selectedStatus,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        await setResponseData(responseData);

        message.success("update order successful!");
      } else {
        const errorMessage = await response.text();
        console.error("update order failed:", errorMessage);
        message.error(`update order failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during update order:", error);
      message.error(`Error during update order: ${error}`);
    }
    setLoading(false);
  };

  const handleDeleteOrder = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/orders/${responseData.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        router.push("/order");
        message.success("Delete order successful!");
      } else {
        const errorMessage = await response.text();
        console.error("Delete order failed:", errorMessage);
        message.error(`Delete order failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during delete order:", error);
      message.error(`Error during delete order: ${error}`);
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <div style={{ marginBottom: "10px", textAlign: "right" }}>
          <Button type="primary" onClick={handleLogout} loading={loading}>
            Logout
          </Button>
        </div>
        <h1>Dashboard Page</h1>
        {responseData && (
          <Card title="Response Data" style={{ marginBottom: "16px" }}>
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </Card>
        )}
        <Card title="Update Order Status Here" bordered={false}>
          <Select
            placeholder="Select status"
            style={{ width: 200, marginRight: 16 }}
            onChange={handleStatusChange}
          >
            <Option value="preparing">Preparing</Option>
            <Option value="serving">Serving</Option>
            <Option value="order_completed">Order Completed</Option>
          </Select>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Submit
          </Button>
        </Card>
        <Card title="Delete Order" style={{ marginTop: "16px" }}>
          <Popconfirm
            title="Are you sure you want to delete this order?"
            onConfirm={handleDeleteOrder}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{
                backgroundColor: "#ff4d4f",
                borderColor: "#ff4d4f",
                color: "#fff",
              }}
              type="danger"
              loading={loading}
            >
              Delete Order
            </Button>
          </Popconfirm>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
