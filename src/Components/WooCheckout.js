import React from "react";
import { View, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useCart } from "../Hook";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

export const WooCheckout = ({ checkoutUrl, ...props }) => {
  const {
    cart: { items },
    resetCart,
  } = useCart();

  const { getItem, setItem } = useAsyncStorage("userOrders");
  const [orders, setOrders] = React.useState([]);
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    let url = checkoutUrl.replace(/\/$/, "") + "/?add-to-cart=";
    if (items?.length) {
      items.forEach((item, index) => {
        if (index === items?.length - 1) {
          url += item?.id;
        } else {
          url += item?.id + ",";
        }
      });
      url += "&qty=";
      items.forEach((item, index) => {
        if (index === items?.length - 1) {
          url += item?.qty;
        } else {
          url += item?.qty + ",";
        }
      });
      setUrl(url);
    }
  }, [items, checkoutUrl]);

  const readItemFromStorage = React.useCallback(async () => {
    const item = await getItem();
    const items = JSON.parse(item);
    setOrders(items || []);
  }, []);

  const writeItemToStorage = async (newValue) => {
    await setItem(JSON.stringify(newValue));
    setOrders(newValue);
  };

  React.useEffect(() => {
    readItemFromStorage();
  }, [readItemFromStorage]);

  const handleMessage = (event) => {
    const order_id = event.nativeEvent.data;
    if (orders.indexOf(order_id) === -1) {
      writeItemToStorage([...orders, order_id]);
      resetCart();
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {Platform.OS === "android" ? (
        <WebView
          source={{ uri: url }}
          scalesPageToFit={false}
          onMessage={handleMessage}
        />
      ) : (
        <iframe
          id="checkout"
          title="Checkout"
          type="text/html"
          width={props.style?.width}
          height={props.style?.height}
          src={url}
          frameBorder={0}
        />
      )}
    </View>
  );
};
