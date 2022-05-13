import React from "react";
import { Platform } from "react-native";
import { Text as TextUi } from "@ui-kitten/components";
import HTML from "react-native-render-html";
import { usePostContent } from "../Hook";
// import AutoHeightWebView from "react-native-autoheight-webview";
import { WebView } from "react-native-webview";

const generateHtml = (content) => `
    <style type="text/css">
      table {
        background-color: transparent;
        width: 100%;
        margin-bottom: 15px;
        font-size: .9em;
        border-spacing: 0;
        border-collapse: collapse;
      }
      table td, table th {
        padding: 15px;
        line-height: 1.5;
        vertical-align: top;
        border: 1px solid #ccc;
      }
    </style>
    ${content}
  `;

const TextView = ({ title, style, ...props }) => {
  const isWeb = !(Platform.OS === "android" || Platform.OS === "ios");

  title = props?.charLength
    ? title?.length > props.charLength
      ? title?.substring(0, props.charLength) + "..."
      : title?.substring(0, props.charLength)
    : title;

  // if (!title) return null;

  return props.isHtml ? (
    isWeb ? (
      <div
        dangerouslySetInnerHTML={{
          __html: props.isWebView ? generateHtml(title) : title,
        }}
      />
    ) : props.isWebView ? (
      <WebView
        style={{
          ...style,
          width: "100%",
        }}
        scalesPageToFit={false}
        originWhitelist={["*"]}
        source={{
          html: generateHtml(title),
        }}
        viewportContent={"width=device-width, user-scalable=no"}
      />
    ) : (
      <HTML
        html={title}
        tagsStyles={{
          span: style,
          p: style,
          del: { textDecorationLine: "line-through" },
        }}
      />
    )
  ) : (
    <TextUi style={style} {...props}>
      {title}
    </TextUi>
  );
};

const PostText = ({ title, ...props }) => {
  const content = usePostContent(title);
  return <TextView {...props} title={content} />;
};

export const Text = ({ postContent, ...props }) => {
  if (postContent && postContent !== "disable") {
    return <PostText {...props} title={postContent} />;
  }

  return <TextView {...props} />;
};
