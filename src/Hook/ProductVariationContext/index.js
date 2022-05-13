import React from "react"

const ProductVariationContext = React.createContext()

function ProductVariationProvider({ children }) {
  const [variation, setVariation] = React.useState(null)
  const handleSetVariation = (value) => {
    setVariation(value)
  }
  return (
    <ProductVariationContext.Provider
      value={{ variation, setVariation: handleSetVariation }}
    >
      {children}
    </ProductVariationContext.Provider>
  )
}

function useProductVariation() {
  const context = React.useContext(ProductVariationContext)
  return context ?? {}
}

export { ProductVariationProvider, useProductVariation }
