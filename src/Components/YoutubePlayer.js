import React from "react"
import { View, Platform } from "react-native"
import { Button } from "react-native-elements"
import { usePostContent } from "../Hook"
import YouTube from "react-native-youtube-iframe"
//import YouTube from "react-youtube"

export const YoutubePlayer = (props) => {
  const [isLoading, setIsLoading] = React.useState(true)

  const handleOnStateChange = () => {}
  const handleOnReady = () => {
    setIsLoading(false)
  }

  const content = usePostContent(props.postContent)
  const videoId = content ?? props.videoId

  return (
    <View style={props.style}>
      {Platform.OS === "android" ? (
        <>
          <YouTube
            key={videoId}
            videoId={videoId}
            onChangeState={handleOnStateChange}
            onReady={handleOnReady}
            width={props.style?.width}
            height={props.style?.height}
          />
          {isLoading && (
            <Button
              loading
              type="clear"
              containerStyle={{
                backgroundColor: "black",
                position: "absolute",
                height: props.style?.height,
                width: props.style?.width,
                justifyContent: "center",
                alignItems: "center"
              }}
              loadingStyle={{ height: 48 }}
            />
          )}
        </>
      ) : (
        <>
          <YouTube
            key={videoId}
            videoId={videoId}
            onStateChange={handleOnStateChange}
            onReady={handleOnReady}
            opts={{
              height: props.style?.height,
              width: props.style?.width,
              playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: false
              }
            }}
          />
          {isLoading && (
            <Button
              loading
              type="clear"
              containerStyle={{
                backgroundColor: "black",
                position: "absolute",
                height: props.style?.height,
                width: props.style?.width,
                justifyContent: "center",
                alignItems: "center"
              }}
              loadingStyle={{ height: 48 }}
            />
          )}
        </>
      )}
    </View>
  )
}
