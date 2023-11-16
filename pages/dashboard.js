// pages/dashboard.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/ProtectedRoute";

const DashboardPage = () => {
  const router = useRouter();
  const responseData = router.query.responseData
    ? JSON.parse(router.query.responseData)
    : null;

  // Use useEffect to redirect to the login page if not authenticated
  useEffect(() => {
    // Add authentication check logic here if needed
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
      <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <div style={{ marginBottom: "10px", textAlign: "right" }}>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <h1>Dashboard Page</h1>
        {/* Display response data if available */}
        {responseData && (
          <div>
            <h3>Response Data:</h3>
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        )}
        {/* Your dashboard content goes here */}
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
