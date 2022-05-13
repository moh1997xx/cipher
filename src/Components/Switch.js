import React from "react"
import { Switch as SwitchUi } from "react-native"
import { useForm } from "../Hook"

export const Switch = ({ style, name, options, ...props }) => {
  const form = useForm()
  const handleChange = (event) => {
    if (form?.handleChange) {
      form.handleChange(name, event.target.checked)
    }
  }
  return (
    <SwitchUi
      {...style}
      onChange={handleChange}
      checked={form?.values?.[name] ?? ""}
      {...props}
    />
  )
}
