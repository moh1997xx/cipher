import React from "react";
import { useRoute } from "@react-navigation/native";

const ItemContext = React.createContext();

export function ItemProvider({ value, children }) {
  const memoValue = React.useMemo(() => value, [value]);
  return (
    <ItemContext.Provider value={memoValue}>{children}</ItemContext.Provider>
  );
}

export function useItem() {
  const context = React.useContext(ItemContext);
  const { params } = useRoute();

  if (context) return context;
  if (params?.item) return params.item;

  return {};
}

export function usePostContent(postContent) {
  const item = useItem();
  return item?.[postContent]?.rendered ?? item?.[postContent];
}

export function usePostImage(content) {
  const item = useItem();
  return item?.[content]?.url ?? item?.images?.[0]?.src ?? item?.image;
}
