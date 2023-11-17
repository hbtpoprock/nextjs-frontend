// pages/order.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/ProtectedRoute";
import { Button } from "antd";

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
    const selectedItemsArray = Object.entries(selectedQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({ [itemId]: quantity }));

    // Update the state with the total price
    const newTotalPrice = selectedItemsArray.reduce(
      (total, item) =>
        total + items[Object.keys(item)[0]].price * Object.values(item)[0],
      0
    );
    setTotalPrice(newTotalPrice);

    // Log the selected items and total price to the console
    console.log("selectedItemsArray:", selectedItemsArray);
    console.log("selectedQuantities:", selectedQuantities);
    console.log("Total Price:", newTotalPrice);

    try {
      // Call your create order API endpoint
      const response = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include the access token in the headers
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          food_ids: selectedQuantities,
          total_price: newTotalPrice,
        }),
      });

      if (response.ok) {
        // Save the response data to state
        const responseData = await response.json();
        await setResponseData(responseData);

        // Redirect to the dashboard page with response data
        router.push({
          pathname: "/dashboard",
          query: { responseData: JSON.stringify(responseData) },
        });
      } else {
        // Handle logout error
        console.error("create order failed:", await response.text());
      }
    } catch (error) {
      console.error("Error during create order:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Call your logout API endpoint
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include the access token in the headers
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        // Clear the access token from localStorage
        localStorage.removeItem("accessToken");

        // Redirect to the login page
        router.push("/login");
      } else {
        // Handle logout error
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <div style={{ marginBottom: "10px", textAlign: "right" }}>
          <Button onClick={handleLogout}>Logout</Button>
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
        <Button type="primary" onClick={handleSubmit}>
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
