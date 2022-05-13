import React from "react";
import { Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useCartReset } from "../Hook";

export default function WooPayOrder({ route }) {
  const resetCart = useCartReset();
  const { getItem, setItem } = useAsyncStorage("userOrders");

  const url = route?.params?.url;

  const updateOrders = async (orderId) => {
    const item = await getItem();
    const orders = JSON.parse(item);
    if (!orders || orders.indexOf(orderId) === -1) {
      const newOrders = orders ? [...orders, orderId] : [orders];
      await setItem(JSON.stringify(newOrders));
    }
  };

  const handleMessage = (event) => {
    const orderId = event.nativeEvent.data;
    resetCart();
    updateOrders(orderId);
  };

  return Platform.OS === "android" ? (
    <WebView
      source={{ uri: url }}
      scalesPageToFit={false}
      onMessage={handleMessage}
    />
  ) : (
    <iframe title="Checkout" src={url} height="100%" width="100%" />
  );
}
