// pages/order.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/ProtectedRoute";

const OrderPage = () => {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState([]);
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

  const handleSubmit = () => {
    const selectedItemsArray = Object.entries(itemToggles)
      .filter(([itemId, isSelected]) => isSelected)
      .map(([itemId]) => Number(itemId));

    // Update the state with the selected items
    setSelectedItems(selectedItemsArray);

    // Log the selected items to the console (you can replace this with your desired logic)
    console.log("Selected Items:", selectedItemsArray);
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
      <div>
        <h1>Order Page</h1>
        {/* Toggle buttons for items */}
        <div>
          <label>
            Item 1
            <input
              type="checkbox"
              checked={itemToggles[1]}
              onChange={() => handleToggle(1)}
            />
          </label>
        </div>
        <div>
          <label>
            Item 2
            <input
              type="checkbox"
              checked={itemToggles[2]}
              onChange={() => handleToggle(2)}
            />
          </label>
        </div>
        <div>
          <label>
            Item 3
            <input
              type="checkbox"
              checked={itemToggles[3]}
              onChange={() => handleToggle(3)}
            />
          </label>
        </div>
        <div>
          <label>
            Item 4
            <input
              type="checkbox"
              checked={itemToggles[4]}
              onChange={() => handleToggle(4)}
            />
          </label>
        </div>

        {/* Submit button */}
        <button onClick={handleSubmit}>Submit</button>

        {/* Your order page content goes here */}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </ProtectedRoute>
  );
};

export default OrderPage;
