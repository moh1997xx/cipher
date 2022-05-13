import React from "react";
import { Text, View } from "react-native";
import { useWooPriceFormat } from "../Hook";

const PriceFormat = ({ value }) => {
  const [part1, part2] = useWooPriceFormat(value);
  return (
    <View style={{ flexDirection: "row" }}>
      <Text>{part1}</Text>
      <Text>{part2}</Text>
    </View>
  );
};

export default PriceFormat;
