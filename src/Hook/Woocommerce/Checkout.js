import React, { useState } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { wooapi } from "../../Api";
import { useCart } from "../Cart";
import { config } from "../../../config";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useSWRCache } from "../Cache";
import { useWooSettings } from "./Utility";
import { countries } from "./Countries";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

export const wooBillingData = atom({
  key: "wooBillingData",
  default: null,
});

export const wooShipping = atom({
  key: "wooShipping",
  default: null,
});

export const wooCountry = atom({
  key: "wooCountry",
  default: {
    name: null,
    states: [],
  },
});

export const wooPlaceOrderMessage = atom({
  key: "wooPlaceOrderMessage",
  default: null,
});

export function useBillingCountry() {
  const settings = useWooSettings();

  const defaultCountry = settings?.find(
    (item) => item.id === "woocommerce_default_country"
  )?.value;

  const setBillingData = useSetRecoilState(wooBillingData);
  const setCountry = useSetRecoilState(wooCountry);

  React.useEffect(() => {
    if (defaultCountry && countries) {
      const countryState = defaultCountry.split(":");
      setBillingData((billingData) => {
        if (!billingData?.country && !billingData?.state) {
          return {
            ...billingData,
            country: countryState[0],
            state: countryState[1],
          };
        }
        return billingData;
      });

      const country = countries.find((item) => item.code === countryState[0]);
      setCountry({ states: country?.states, name: country?.name });
    }
  }, [defaultCountry, setBillingData, setCountry]);

  const isLoading = !countries || !settings;
  const options = React.useMemo(() => {
    const allowedCountries = settings?.find(
      (item) => item.id === "woocommerce_allowed_countries"
    );

    const exceptCountries = settings?.find(
      (item) => item.id === "woocommerce_all_except_countries"
    );

    const specificCountries = settings?.find(
      (item) => item.id === "woocommerce_specific_allowed_countries"
    );

    return allowedCountries?.value === "specific"
      ? countries?.filter((item) =>
          specificCountries?.value?.includes(item?.code)
        )
      : allowedCountries?.value === "all_except"
      ? countries?.filter(
          (item) => !exceptCountries?.value?.includes(item?.code)
        )
      : countries;
  }, [settings]);
  return { countries: options, isLoading };
}

export function useNoBillingCountry() {
  const setCountry = useSetRecoilState(wooCountry);

  const settings = useWooSettings();

  React.useEffect(() => {
    const allowedCountries = settings?.find(
      (item) => item.id === "woocommerce_allowed_countries"
    );

    const specificCountries = settings?.find(
      (item) => item.id === "woocommerce_specific_allowed_countries"
    );

    if (
      allowedCountries?.value === "specific" &&
      specificCountries?.value?.length === 1
    ) {
      const country = countries.find(
        (item) => item.code === specificCountries.value[0]
      );
      setCountry({ states: country?.states, name: country?.name });
    }
  }, [settings, setCountry]);
}

export function usePlaceOrder() {
  const {
    cart: { items },
    resetCart,
  } = useCart();

  const billingData = useRecoilValue(wooBillingData);
  const shipping = useRecoilValue(wooShipping);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { getItem, setItem } = useAsyncStorage("userOrders");

  const updateCartOrderData = async (orderId) => {
    const item = await getItem();
    const items = JSON.parse(item);
    const newItems =
      items && Array.isArray(items) ? [...items, orderId] : [orderId];
    await setItem(JSON.stringify(newItems));
    resetCart();
  };

  const onPlaceOrder = ({ checkoutUrl }) => {
    const lineItems = items?.map((item) => ({
      product_id: item?.id,
      quantity: item?.qty,
    }));

    const data = {
      billing: billingData,
      shipping: billingData,
      shipping_lines: shipping,
      line_items: lineItems,
    };

    setIsLoading(true);

    wooapi
      .post("orders", data)
      .then((response) => {
        setIsLoading(false);
        if (!checkoutUrl || checkoutUrl === "") {
          const baseUrl = config.baseUrl.replace(/\/+$/, "");
          checkoutUrl = `${baseUrl}/checkout`;
        }
        checkoutUrl = checkoutUrl.replace(/\/+$/, "");
        if (response?.data?.id) {
          updateCartOrderData(response.data.id);
          const params = {
            url: `${checkoutUrl}/order-pay/${response?.data?.id}?pay_for_order=true&key=${response?.data?.order_key}`,
            title: "Payment",
          };

          navigation.dispatch((state) => {
            // Add the home route to the start of the stack
            const routes = [state.routes[0], { name: "payorder", params }];

            return CommonActions.reset({
              ...state,
              routes,
              index: 1,
            });
          });
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  return {
    onPlaceOrder,
    isLoading,
  };
}

async function fetchZones(url) {
  const response = await wooapi.get(url);
  const zones = response?.data;
  const promisesToAwait = [];
  zones.forEach((zone) => {
    promisesToAwait.push(wooapi.get(`${url}/${zone.id}/locations`));
  });

  const locations = await Promise.all(promisesToAwait);
  return { zones, locations };
}

async function fetchShippingMethods(url) {
  const methods = await wooapi.get(url);
  return methods?.data;
}

export function useShippingMethods() {
  const billingData = useRecoilValue(wooBillingData);

  const dataZones = useSWRCache("shipping/zones", fetchZones);
  const shippingMethodUrl = () => {
    if (!dataZones) return null;
    const { zones, locations } = dataZones;
    let found = false;
    let selectedZone = 0;
    zones.some((zone, index) => {
      found = locations[index].data.some((location) => {
        if (location?.type === "state") {
          return (
            location?.code === `${billingData?.country}:${billingData?.state}`
          );
        }
        return location?.code === billingData?.country;
      });
      if (found) selectedZone = zone.id;
      return found;
    });
    return `shipping/zones/${selectedZone}/methods`;
  };

  const shippingMethods = useSWRCache(shippingMethodUrl, fetchShippingMethods);
  return shippingMethods;
}
