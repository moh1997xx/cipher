import React from "react"

const CheckoutContext = React.createContext()

function CheckoutProvider({ value, children }) {
  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  )
}

function useCheckout() {
  const context = React.useContext(CheckoutContext)
  return context
}

export { CheckoutProvider, useCheckout }
