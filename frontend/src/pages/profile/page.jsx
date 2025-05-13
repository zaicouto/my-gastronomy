import React from "react";
import s from "./page.module.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useAuth } from "../../hooks/use-auth";
import { useOrders } from "../../hooks/use-orders.js";
import Loader from "../../components/loader.jsx";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { getUserOrders, loading } = useOrders();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h1>Perfil</h1>
      <div className={s.container}>
        <h2>
          Boas-vindas, {userData?.user?.fullName || userData?.user?.email}
        </h2>
        <Button
          onClick={() => {
            logout();
            navigate("/auth");
          }}
        >
          Logout
        </Button>
        <div>
          <h3>Pedidos</h3>
          {userData?.orders?.length > 0 ? (
            <ul className={s.ordersList}>
              {userData.orders.map((order) => (
                <li key={order._id} className={s.orderItem}>
                  <p>ID do Pedido: {order._id}</p>
                  <p>Data: {new Date(order.pickupTime).toLocaleDateString()}</p>
                  <p>Status: {order.status}</p>
                  <ul className={s.itemsList}>
                    {order.items.map((item) => (
                      <li key={item._id}>
                        <h4>Produto: {item.details[0].name}</h4>
                        <p>Quantidade: {item.quantity}</p>
                        <p>Preço: R$ {item.details[0].price.toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum pedido encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
