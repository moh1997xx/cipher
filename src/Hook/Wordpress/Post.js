import React from "react";
import useSWR from "swr";
import { PostTypeProvider } from "../PostTypeContext";
import { wpapi } from "../../Api";
import { useCache } from "../Cache";

async function fetchPost(json) {
  const param = JSON.parse(json);
  let { postType, ...query } = param;

  if (!postType) return [];

  postType = postType === "post" ? "posts" : postType;
  if (typeof wpapi[postType] === "undefined") {
    wpapi[postType] = wpapi.registerRoute(
      "wp/v2",
      "/" + postType + "/(?P<id>\\d+)",
      {
        params: ["categories", "order", "orderby"],
      }
    );
  }

  let fetcher = wpapi[postType]();
  query &&
    Object.keys(query).forEach((key) => {
      const value = query[key];
      if (fetcher?.[key] && value) {
        fetcher = fetcher?.[key](value);
      }
    });

  const response = await fetcher;
  return response;
}

function useGetPostData(query = {}, postType = "post") {
  const json = JSON.stringify({ postType, ...query });
  const { data } = useSWR(json, fetchPost);
  const cache = useCache(json, !data);
  return { data: data ?? cache, isLoading: !data };
}

function PostRoot({ children, postType }) {
  return <PostTypeProvider value={postType}>{children}</PostTypeProvider>;
}

export { PostRoot, useGetPostData };
