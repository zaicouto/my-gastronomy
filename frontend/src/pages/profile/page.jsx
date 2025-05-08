import React from "react";
import s from "./page.module.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useAuth } from "../../hooks/use-auth";
import { useCart } from "../../hooks/use-cart.js";
import Loader from "../../components/loader.jsx";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { getUserOrders, loading } = useCart();
  const [userData, setUserData] = React.useState({});

  React.useEffect(() => {
    const authToken = localStorage.getItem("auth-token");

    if (!authToken) {
      console.log("No auth token found, redirecting to auth page...");
      navigate("/auth");
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("User ID: ", user?._id);

      getUserOrders(user?._id).then((orders) => {
        if (orders.error) {
          console.error("Error fetching user orders: ", orders.error);
          return;
        }

        console.log("User orders: ", orders);
        setUserData({ user, orders });
      });
    }
  }, [navigate, getUserOrders]);

  if (loading) {
    return <Loader />;
  }

  const user = userData?.user;
  return (
    <div>
      <h1>Perfil</h1>
      <div className={s.profileContainer}>
        <h2>Boas-vindas, {user?.fullName || user?.email}</h2>
        <Button
          onClick={() => {
            logout();
            navigate("/auth");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
