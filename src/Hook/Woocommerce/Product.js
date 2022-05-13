import React from "react";
import useSWR from "swr";
import { PostTypeProvider } from "../PostTypeContext";
import { wooapi } from "../../Api";
import { useItem } from "../PostContent";
import { useCache } from "../Cache";

async function fetchProduct(query) {
  const response = await wooapi.get("products", query);
  return response?.data;
}

async function fetchData(json) {
  const param = JSON.parse(json);
  let { postType, ...query } = param;

  let products = [];
  if (query?.bestSeller) {
    let response = await wooapi.get("reports/top_sellers", { period: "year" });
    let bestSellerQuery = { ...query };
    if (response?.data?.length) {
      const include = response?.data?.map((item) => item.product_id).join();
      bestSellerQuery = { ...query, include };
    }
    products = await fetchProduct(bestSellerQuery);
  } else {
    products = await fetchProduct(query);
  }

  return products;
}

function useGetProductData(query = {}) {
  const product = useItem();
  if (query?.related) {
    delete query.related;
    query = { ...query, category: product.categories?.[0]?.id };
  }

  const json = JSON.stringify({ postType: "product", ...query });
  const { data, isValidating } = useSWR(json, fetchData);
  const cache = useCache(json, !data);
  return { data: data ?? cache, isLoading: isValidating };
}

function ProductRoot({ children }) {
  return <PostTypeProvider value="product">{children}</PostTypeProvider>;
}

export { ProductRoot, useGetProductData };
