import React from "react";
import { View, Platform } from "react-native";
import { WebView as NativeWebView } from "react-native-webview";

export const WebView = ({ url, ...props }) => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      {Platform.OS === "android" ? (
        <NativeWebView source={{ uri: url }} scalesPageToFit={false} />
      ) : (
        <iframe
          id="checkout"
          title="Checkout"
          type="text/html"
          width={props.style?.width}
          height={props.style?.height}
          src={url}
          frameBorder={0}
        />
      )}
    </View>
  );
};
