import React from "react"

const PostTypeContext = React.createContext()

function PostTypeProvider({ value, children }) {
  return (
    <PostTypeContext.Provider value={value}>
      {children}
    </PostTypeContext.Provider>
  )
}

function usePostType() {
  const context = React.useContext(PostTypeContext)

  if (context === undefined) {
    return false
  }

  if (Array.isArray(context)) {
    return context[0]
  }
  return context
}

function usePostTypeContent() {
  const context = React.useContext(PostTypeContext)

  if (context === undefined) {
    return false
  }

  if (Array.isArray(context)) {
    return context[1]
  }
  return context
}

export { PostTypeProvider, usePostType, usePostTypeContent }
