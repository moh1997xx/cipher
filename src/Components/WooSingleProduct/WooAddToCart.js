import React, { useState } from "react";
import { Layout, Input } from "@ui-kitten/components";
import {
  CustomPropsProvider,
  useItem,
  useCart,
  useProductVariation,
} from "../../Hook";

export const WooAddToCart = (props) => {
  const item = useItem();
  const { addCart } = useCart();
  const { variation } = useProductVariation();
  const [qty, setQty] = useState("1");

  const handleOnPress = React.useCallback(() => {
    if (item?.variations?.length) addCart(variation, qty);
    else addCart(item, qty);
  }, [addCart, item, variation, qty]);

  const disabled = !item?.variations?.length ? false : !variation?.id;

  const memoValue = React.useMemo(
    () => ({ onPress: handleOnPress, disabled }),
    [handleOnPress, disabled]
  );

  return (
    <Layout style={{ flexDirection: "row", alignItems: "center" }}>
      <Input
        value={qty}
        onChangeText={(value) => setQty(value)}
        style={{ width: 60, marginRight: 8 }}
      />
      <CustomPropsProvider value={memoValue}>
        {props.children}
      </CustomPropsProvider>
    </Layout>
  );
};
