// components/ProtectedRoute.js
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // Redirect to the login page if the token is not present
      router.push("/login");
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
