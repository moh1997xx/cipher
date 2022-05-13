import React from "react";
import useSWR from "swr";
import { PostTypeProvider } from "../PostTypeContext";
import { wooapi } from "../../Api";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

async function fetchData(json) {
  const param = JSON.parse(json);
  let { postType, ...query } = param;
  const response = await wooapi.get(postType + "s", query);
  return response?.data;
}

function useGetOrderData() {
  const { getItem } = useAsyncStorage("userOrders");
  const [orderIds, setOrderIds] = React.useState();
  const { data: orders, isValidating } = useSWR(
    orderIds?.length
      ? JSON.stringify({
          postType: "order",
          include: orderIds.join(),
        })
      : null,
    fetchData
  );

  const { data: products } = useSWR(() => {
    let ids = [];
    if (Array.isArray(orders)) {
      orders.forEach((order) => {
        order.line_items.forEach((item) => {
          ids.push(item?.product_id);
        });
      });
    }

    return (
      ids?.length &&
      JSON.stringify({
        postType: "product",
        include: ids.join(),
      })
    );
  }, fetchData);

  useFocusEffect(
    React.useCallback(() => {
      async function getOrders() {
        const item = await getItem();
        const items = JSON.parse(item);
        setOrderIds(items || []);
      }
      getOrders();
    }, []) //get item need a memo
  );

  if (Array.isArray(orderIds) && !orderIds.length) {
    return {
      data: [],
      isLoading: false,
    };
  }

  const items = orders?.map((order) => {
    const line_items = order?.line_items?.map((line_item) => {
      const product_id = line_item?.product_id;
      const product = products?.find((product) => product?.id === product_id);
      return { ...line_item, image: product?.images?.[0]?.src };
    });

    const line_item = line_items?.reduce(
      (acc, item) => `${acc}${item?.name} x ${item?.quantity} \n`,
      ""
    );

    return { ...order, line_items, line_item, image: line_items?.[0]?.image };
  });

  return {
    data: items,
    isLoading: isValidating,
  };
}

function OrderRoot({ children }) {
  return <PostTypeProvider value="order">{children}</PostTypeProvider>;
}

export { OrderRoot, useGetOrderData };
