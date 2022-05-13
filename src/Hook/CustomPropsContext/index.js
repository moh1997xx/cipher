import React from "react"

const CustomPropsContext = React.createContext()

function CustomPropsProvider({ value, children }) {
  return (
    <CustomPropsContext.Provider value={value}>
      {children}
    </CustomPropsContext.Provider>
  )
}

function useCustomProps() {
  const context = React.useContext(CustomPropsContext)
  if (context === undefined) {
    return {}
  }
  return context
}

export { CustomPropsProvider, useCustomProps }
