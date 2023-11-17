// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import { Input, Button, message } from "antd";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.token;

        localStorage.setItem("accessToken", accessToken);

        router.push("/order");

        message.success("Login successful!");
      } else {
        const errorMessage = await response.text();
        message.error(`Login failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      message.error(`Error during login: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "300px", margin: "auto", marginTop: "100px" }}>
      <h1>Login</h1>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Input.Password
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <Button
        type="primary"
        onClick={handleLogin}
        loading={loading}
        style={{ width: "100%" }}
      >
        Login
      </Button>
    </div>
  );
};

export default Login;
