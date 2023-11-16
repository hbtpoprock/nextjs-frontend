// pages/protected.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/ProtectedRoute";

const OrderPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Add any additional logic you need when the protected page loads
  }, []);

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
        <h1>OrderPage Page</h1>
        {/* Your protected page content goes here */}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </ProtectedRoute>
  );
};

export default OrderPage;
