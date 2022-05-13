import React from "react"
import { View } from "react-native"
import { FormRoot } from "../Hook"

export const Form = ({
  children,
  initialValues,
  postType,
  style,
  ...props
}) => {
  return (
    <FormRoot initialValues={initialValues} postType={postType}>
      <View style={style} {...props}>
        {children}
      </View>
    </FormRoot>
  )
}
