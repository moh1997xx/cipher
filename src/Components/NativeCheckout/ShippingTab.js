import React, { useState, useEffect } from "react";
import { View } from "react-native";
import {
  RadioGroup,
  Radio,
  Button,
  Spinner,
  Text,
} from "@ui-kitten/components";
import { useRecoilState } from "recoil";
import { useShippingMethods, wooShipping, usePlaceOrder } from "../../Hook";
import PriceFormat from "../PriceFormat";

const LoadingIndicator = () => (
  <View style={{ alignItems: "center", justifyContent: "center" }}>
    <Spinner size="small" />
  </View>
);

export const ShippingTab = ({
  checkoutUrl,
  shippingTitle,
  placeOrderTitle,
}) => {
  const [index, setIndex] = useState(0);
  const [shipping, setShipping] = useRecoilState(wooShipping);
  const { onPlaceOrder, isLoading } = usePlaceOrder({ checkoutUrl });
  const shippingMethods = useShippingMethods();

  const handleSelectShipping = (index) => {
    setIndex(index);
    const methods = shippingMethods?.filter((item) => item.enabled);
    setShipping([
      {
        method_id: methods?.[index]?.method_id,
        method_title: methods?.[index]?.method_id,
        total: methods?.[index]?.settings?.cost?.value ?? "0",
      },
    ]);
  };

  useEffect(() => {
    if (shippingMethods && !shipping) {
      const methods = shippingMethods?.filter((item) => item.enabled);
      setShipping([
        {
          method_id: methods?.[index]?.method_id,
          method_title: methods?.[index]?.method_id,
          total: methods?.[index]?.settings?.cost?.value ?? "0",
        },
      ]);
    }
  }, [shippingMethods, shipping, setShipping, index]);

  return (
    <View style={{ marginTop: 16 }}>
      <Text category="h4">{shippingTitle ?? "Shipping"}</Text>
      <RadioGroup
        selectedIndex={index}
        onChange={(index) => handleSelectShipping(index)}
      >
        {shippingMethods
          ?.filter((item) => item.enabled)
          .map(({ id, title, settings }) => {
            const cost =
              settings?.cost?.value === "" ? 0 : settings?.cost?.value ?? 0;
            return (
              <Radio key={id}>
                {() => (
                  <View style={{ flexDirection: "row", marginLeft: 4 }}>
                    <Text>{`${title} : `}</Text>
                    <PriceFormat value={cost} />
                  </View>
                )}
              </Radio>
            );
          })}
      </RadioGroup>
      {isLoading ? (
        <Button
          style={{ marginTop: 8 }}
          disabled
          accessoryLeft={LoadingIndicator}
        >
          {placeOrderTitle ?? "Place Order"}
        </Button>
      ) : (
        <Button style={{ marginVertical: 16 }} onPress={onPlaceOrder}>
          {placeOrderTitle ?? "Place Order"}
        </Button>
      )}
    </View>
  );
};
