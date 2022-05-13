import React from "react"
import Swiper from "./react-native-web-swiper"
import { View } from "react-native"

export const Carousel = (props) => {
  const { style, children, ...restProps } = props
  const { autoplay, timeout, dot, dotColor } = restProps

  return (
    <View style={style}>
      <Swiper
        loop={true}
        timeout={autoplay === "yes" ? timeout : false}
        controlsProps={{
          dotsTouchable: true,
          dotsPos: dot === "yes" ? "bottom" : false,
          dotActiveStyle: { backgroundColor: dotColor },
          prevPos: false,
          nextPos: false
        }}
      >
        {children}
      </Swiper>
    </View>
  )
}
