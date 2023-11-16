// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Successful login
        const data = await response.json();
        const accessToken = data.token;

        // Save the access token to localStorage
        localStorage.setItem("accessToken", accessToken);

        // Redirect to the protected page
        router.push("/order");

        // Optionally, you can reset the error message
        setErrorMessage(null);
      } else {
        // Handle login error
        const errorMessage = await response.text();
        setErrorMessage(errorMessage);
        console.error("Login failed:", errorMessage);

        // Optionally, you can reset the success message
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default Login;
