import React from "react";
import { View } from "react-native";
import { BillingTab } from "./NativeCheckout/BillingTab";
import { ShippingTab } from "./NativeCheckout/ShippingTab";
import { Text } from "@ui-kitten/components";
import { useRecoilValue } from "recoil";
import { wooPlaceOrderMessage } from "../Hook";

export const NativeCheckout = ({
  style,
  fields,
  checkoutUrl,
  placeOrderTitle,
}) => {
  const message = useRecoilValue(wooPlaceOrderMessage);

  return (
    <View style={style}>
      {message && message !== "" ? (
        <Text style={{ marginBottom: 16 }} status="danger">
          message
        </Text>
      ) : null}
      <BillingTab fields={fields} />
      <ShippingTab
        checkoutUrl={checkoutUrl}
        placeOrderTitle={placeOrderTitle}
      />
    </View>
  );
};
