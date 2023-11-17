// pages/order.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/ProtectedRoute";
import { Button, message } from "antd";

const items = {
  1: { name: "Item 1", price: 3 },
  2: { name: "Item 2", price: 4 },
  3: { name: "Item 3", price: 1 },
  4: { name: "Item 4", price: 2 },
};

const OrderPage = () => {
  const router = useRouter();
  const [responseData, setResponseData] = useState(null);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (itemId, quantity) => {
    setSelectedQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: quantity,
    }));
  };

  const calculateTotalPrice = () => {
    return Object.entries(selectedQuantities).reduce(
      (total, [itemId, quantity]) => total + items[itemId].price * quantity,
      0
    );
  };

  const handleSubmit = async () => {
    setLoading(true);

    const selectedItemsArray = Object.entries(selectedQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({ [itemId]: quantity }));

    const newTotalPrice = selectedItemsArray.reduce(
      (total, item) =>
        total + items[Object.keys(item)[0]].price * Object.values(item)[0],
      0
    );
    setTotalPrice(newTotalPrice);

    console.log("selectedItemsArray:", selectedItemsArray);
    console.log("selectedQuantities:", selectedQuantities);
    console.log("Total Price:", newTotalPrice);
    if (newTotalPrice == 0) {
      setLoading(false);
      message.error(`create order failed: Total Price cannot be 0`);
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          food_ids: selectedQuantities,
          total_price: newTotalPrice,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        await setResponseData(responseData);

        router.push({
          pathname: "/dashboard",
          query: { responseData: JSON.stringify(responseData) },
        });
        message.success("create order successful!");
      } else {
        const errorMessage = await response.text();
        console.error("create order failed:", errorMessage);
        message.error(`create order failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during create order:", error);
      message.error(`Error during create order: ${error}`);
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

  return (
    <ProtectedRoute>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <div style={{ marginBottom: "10px", textAlign: "right" }}>
          <Button onClick={handleLogout} loading={loading}>
            Logout
          </Button>
        </div>
        <h1>Order Page</h1>
        {Object.entries(items).map(([itemId, item]) => (
          <div key={itemId} style={{ marginBottom: "10px" }}>
            <span>
              {item.name} - {item.price} USD
            </span>
            <Button
              onClick={() =>
                handleQuantityChange(
                  itemId,
                  selectedQuantities[itemId]
                    ? selectedQuantities[itemId] - 1
                    : 0
                )
              }
              style={{ marginLeft: "8px" }}
            >
              -
            </Button>
            <span style={{ margin: "0 10px" }}>
              {selectedQuantities[itemId] || 0}
            </span>
            <Button
              onClick={() =>
                handleQuantityChange(
                  itemId,
                  selectedQuantities[itemId]
                    ? selectedQuantities[itemId] + 1
                    : 1
                )
              }
            >
              +
            </Button>
          </div>
        ))}
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          Submit
        </Button>

        {Object.entries(selectedQuantities).length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>Selected Quantities:</h3>
            <pre>{JSON.stringify(selectedQuantities, null, 2)}</pre>
            <h3>Total Price:</h3>
            <p>{calculateTotalPrice()} USD</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default OrderPage;
