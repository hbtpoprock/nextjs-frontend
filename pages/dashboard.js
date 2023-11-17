// pages/dashboard.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Card } from "antd";
import ProtectedRoute from "../components/ProtectedRoute";

const DashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const responseData = router.query.responseData
    ? JSON.parse(router.query.responseData)
    : null;

  // Use useEffect to redirect to the login page if not authenticated
  useEffect(() => {
    // Add authentication check logic here if needed
  }, []);

  const handleLogout = async () => {
    setLoading(true);

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
        message.success("Logout successful!");
      } else {
        // Handle logout error
        const errorMessage = await response.text();
        console.error("Logout failed:", errorMessage);
        message.error(`Logout failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during logout:", error);
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
        {/* Display response data if available */}
        {responseData && (
          <Card title="Response Data" style={{ marginBottom: "16px" }}>
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </Card>
        )}
        {/* Your dashboard content goes here */}
        <Card title="Your Dashboard Content" bordered={false}>
          {/* Add your dashboard content here */}
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
