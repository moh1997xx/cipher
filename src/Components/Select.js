import React from "react"
import { Picker } from "@react-native-community/picker"
import { useForm } from "../Hook"

export const Select = ({ style, name, options, ...props }) => {
  const form = useForm()
  const handleChange = (value, index) => {
    if (form?.handleChange) {
      form.handleChange(name, value)
    }
  }
  return (
    <Picker
      selectedValue={form?.values?.[name] ?? ""}
      style={style}
      onValueChange={handleChange}
    >
      {Array.isArray(options) &&
        options.map((item) => (
          <Picker.Item label={item.label} value={item.value} />
        ))}
    </Picker>
  )
}
