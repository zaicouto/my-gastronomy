import { useState } from "react";
import { baseUrl } from "../utils/constants.js";

export function useOrders() {
  const [loading, setLoading] = useState(false);

  const getUserOrders = async (userId) => {
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/orders/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

      const data = await response.json();
      console.log("User orders response: ", data);

      if (data.error) {
        throw new Error(data.error);
      }

      return data.body;
    } catch (error) {
      console.error("Error fetching user orders: ", error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getUserOrders,
  };
}
