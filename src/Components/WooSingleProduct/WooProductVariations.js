import React from "react"
import { Text, Layout, Button } from "@ui-kitten/components"
import {
  useSingleProduct,
  useGetProductVariations,
  useProductVariation
} from "../../Hook"

const getAttributes = (variations) => {
  const attributes = {}
  variations.forEach((item) => {
    item.attributes.forEach((attr) => {
      attributes[attr.name] = !attributes[attr.name]
        ? [attr.option]
        : attributes[attr.name].includes(attr.option)
        ? attributes[attr.name]
        : [...attributes[attr.name], attr.option]
    })
  })
  return attributes
}

const getActiveOptions = (variations, selectedOptions) => {
  const active = {}
  const selected =
    selectedOptions &&
    Object.keys(selectedOptions).map((name) => name + selectedOptions[name])

  if (selected) {
    variations.forEach((item) => {
      let find = 0
      selected.forEach((option) => {
        if (
          item?.attributes?.find((attr) => attr.name + attr.option === option)
        ) {
          find++
        }
      })

      if (find === selected.length) {
        item.attributes.forEach((attr) => {
          active[attr.name + attr.option] = true
        })
      }
    })
  }

  return active
}

export const WooProductVariations = (props) => {
  const singleProduct = useSingleProduct()
  const { variations = [] } = useGetProductVariations(
    singleProduct?.product?.id
  )
  const { setVariation } = useProductVariation()

  const [selectedVariations, setSelectedVariations] = React.useState(null)

  const attributes = getAttributes(variations)

  const handleSelectVariation = (option, name) => {
    let newSelectedVariations = {}
    if (selectedVariations?.[name] === option) {
      const temp = { ...selectedVariations }
      delete temp[name]
      newSelectedVariations = temp
    } else {
      newSelectedVariations = selectedVariations
        ? { ...selectedVariations, [name]: option }
        : { [name]: option }
    }

    setSelectedVariations(newSelectedVariations)

    const variation = variations.find((item) => {
      let find = 0
      const selected = []
      if (newSelectedVariations) {
        Object.keys(newSelectedVariations).forEach((key) => {
          selected.push(key + newSelectedVariations[key])
        })
      }
      selected.forEach((option) => {
        if (
          item?.attributes?.find((attr) => attr.name + attr.option === option)
        ) {
          find++
        }
      })

      if (find && find === variations[0]?.attributes?.length) {
        return true
      }
      return false
    })

    setVariation(variation)
  }

  return (
    <Layout style={props.style}>
      {!!variations.length &&
        Object.keys(attributes)?.map((key) => (
          <Layout
            key={key}
            style={{
              flexDirection: "row",
              alignItems: "center",
              margin: 8
            }}
          >
            <Text
              category="s1"
              style={{
                width: "20%"
              }}
            >
              {key}
            </Text>
            <Layout flex={1} key={key} style={{ flexDirection: "row" }}>
              {attributes[key].map((item, index) => {
                const activeOptions = getActiveOptions(
                  variations,
                  selectedVariations
                )
                const isActive =
                  !selectedVariations || variations.length === 1
                    ? true
                    : activeOptions?.[key + item]

                return (
                  <Button
                    status={
                      selectedVariations?.[key] === item ? "primary" : "basic"
                    }
                    disabled={!isActive}
                    key={index}
                    onPress={() => handleSelectVariation(item, key)}
                  >
                    {item}
                  </Button>
                )
              })}
            </Layout>
          </Layout>
        ))}
    </Layout>
  )
}
