import React from "react";
import { PostTypeProvider } from "../PostTypeContext";
import { useRoute } from "@react-navigation/native";
import { wooapi } from "../../Api";
import useSWR from "swr";
import { ProductVariationProvider } from "../ProductVariationContext";

function useGetProductVariations(id) {
  async function fetchProductVariations(url) {
    const response = await wooapi.get(url);
    return response?.data;
  }

  const { data, isValidating } = useSWR(
    () => (id ? `products/${id}/variations` : null),
    fetchProductVariations
  );
  return { variations: data, isLoading: isValidating };
}

function useSingleProduct() {
  const { params } = useRoute();
  const product = params?.item;
  const images = params?.item.images;
  return { product, images };
}

function SingleProductRoot({ children }) {
  const memoValue = React.useMemo(() => ["product", "singleProduct"], []);

  return (
    <PostTypeProvider value={memoValue}>
      <ProductVariationProvider>{children}</ProductVariationProvider>
    </PostTypeProvider>
  );
}

export { SingleProductRoot, useSingleProduct, useGetProductVariations };
