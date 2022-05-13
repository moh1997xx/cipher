import React from "react";
import { Rating } from "react-native-elements";
import { useSingleProduct } from "../../Hook";

export const WooProductRating = ({ style, icon }) => {
  const singleProduct = useSingleProduct();

  return (
    <Rating
      imageSize={icon.size}
      ratingColor={icon.color}
      type="custom"
      readonly
      startingValue={parseInt(singleProduct.product?.average_rating)}
      style={style}
    />
  );
};
