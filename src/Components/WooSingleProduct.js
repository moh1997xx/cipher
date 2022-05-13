import React from "react";
import { SingleProductRoot } from "../Hook";

export * from "./WooSingleProduct/WooImageCarousel";
export * from "./WooSingleProduct/WooProductVariations";
export * from "./WooSingleProduct/WooAddToCart";
export * from "./WooSingleProduct/WooProductRating";

export const WooSingleProduct = ({ children }) => {
  return <SingleProductRoot>{children}</SingleProductRoot>;
};
