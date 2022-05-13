import React from "react"
import { View } from "react-native"
import { SearchBar } from "react-native-elements"
import debounce from "lodash.debounce"
import {
  PostRoot,
  ProductRoot,
  useGetProductData,
  useGetPostData
} from "../Hook"
import { FlatListComp } from "./GridPost"

const ProductList = ({ query, postType, onLoading, ...props }) => {
  const { data, isLoading } = useGetProductData(query)

  React.useEffect(() => {
    onLoading(isLoading)
  }, [isLoading, onLoading])

  return (
    <ProductRoot query={query}>
      <FlatListComp data={data} postType={postType} {...props} />
    </ProductRoot>
  )
}

const PostList = ({ query, postType, onLoading, ...props }) => {
  const { data, isLoading } = useGetPostData(query, postType)

  React.useEffect(() => {
    onLoading(isLoading)
  }, [isLoading, onLoading])

  return (
    <PostRoot query={query}>
      <FlatListComp data={data} postType={postType} {...props} />
    </PostRoot>
  )
}

export const SearchPostComp = ({ searchQuery, ...props }) => {
  const postType = props?.postType

  return postType === "product" ? (
    <ProductList
      query={{ ...props.productQuery, search: searchQuery }}
      {...props}
    />
  ) : (
    <PostList query={{ ...props.postQuery, search: searchQuery }} {...props} />
  )
}

export const SearchPost = ({ style, ...props }) => {
  const [search, setSearch] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const debounceHandleChange = React.useCallback(
    debounce((value) => setSearchQuery(value), 1000),
    []
  )

  const updateSearch = (search) => {
    setSearch(search)
    debounceHandleChange(search)
  }

  const handleShowLoading = (value) => {
    setIsLoading(value)
  }

  return (
    <View>
      <SearchBar
        onChangeText={updateSearch}
        value={search}
        platform="android"
        showLoading={isLoading}
        containerStyle={style}
        placeholder="search"
      />
      <SearchPostComp
        searchQuery={searchQuery}
        {...props}
        onLoading={handleShowLoading}
      />
    </View>
  )
}
