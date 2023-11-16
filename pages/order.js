import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/ProtectedRoute";
import { Checkbox, Button } from "antd";

const items = {
  1: { name: "Item 1", price: 3 },
  2: { name: "Item 2", price: 4 },
  3: { name: "Item 3", price: 1 },
  4: { name: "Item 4", price: 2 },
};

const OrderPage = () => {
  const router = useRouter();
  const [responseData, setResponseData] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemToggles, setItemToggles] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  useEffect(() => {
    // Add any additional logic you need when the order page loads
  }, []);

  const handleToggle = (itemId) => {
    setItemToggles((prevToggles) => ({
      ...prevToggles,
      [itemId]: !prevToggles[itemId],
    }));
  };

  const handleSubmit = async () => {
    const selectedItemsArray = Object.entries(itemToggles)
      .filter(([itemId, isSelected]) => isSelected)
      .map(([itemId]) => Number(itemId));

    // Update the state with the selected items
    setSelectedItems(selectedItemsArray);

    // Calculate total price
    const newTotalPrice = selectedItemsArray.reduce(
      (total, itemId) => total + items[itemId].price,
      0
    );

    // Update the state with the total price
    setTotalPrice(newTotalPrice);

    // Log the selected items and total price to the console
    console.log("Selected Items:", selectedItemsArray);
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
          food_ids: selectedItemsArray,
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
        {/* Toggle buttons for items */}
        {Object.entries(items).map(([itemId, item]) => (
          <div key={itemId}>
            <Checkbox
              checked={itemToggles[itemId]}
              onChange={() => handleToggle(itemId)}
            >
              {item.name} - {item.price} USD
            </Checkbox>
          </div>
        ))}

        {/* Submit button on a new line */}
        <div style={{ marginTop: "10px" }}>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>

        {/* Display selected items and total price */}
        {selectedItems.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>Selected Items:</h3>
            <ul>
              {selectedItems.map((itemId) => (
                <li key={itemId}>{items[itemId].name}</li>
              ))}
            </ul>
            <h3>Total Price: {totalPrice} USD</h3>
          </div>
        )}

        {/* Your order page content goes here */}
      </div>
    </ProtectedRoute>
  );
};

export default OrderPage;
