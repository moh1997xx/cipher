import React from "react";
import { PostTypeProvider } from "../PostTypeContext";
import { useRoute } from "@react-navigation/native";

function useSinglePost() {
  const { params } = useRoute();
  const post = params?.item;
  return { post };
}

function SinglePostRoot({ children, postType }) {
  const memoValue = React.useMemo(() => [postType, "singlePost"], [postType]);

  return <PostTypeProvider value={memoValue}>{children}</PostTypeProvider>;
}

export { SinglePostRoot, useSinglePost };
