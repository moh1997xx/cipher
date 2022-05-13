// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import WooCommerceRestApi from "./WoocommerceApi";
import { config } from "../../config";

const wooapiConfig = {
  url: config.baseUrl,
  consumerKey: config.ck ?? "consumerKey",
  consumerSecret: config.cs ?? "consumerSecret",
  version: "wc/v3",
  queryStringAuth: true,
};

export const wooapi = new WooCommerceRestApi(wooapiConfig);

export const useWooapi = () => {
  return wooapi;
};
