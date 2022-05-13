import React from 'react'

const IndexContext = React.createContext()

function IndexProvider({value, children}) {
  return (
    <IndexContext.Provider value={value}>      
      {children}     
    </IndexContext.Provider>
  )
}

function useIndex() {
  const context = React.useContext(IndexContext)
  
  if (context === undefined) {
    return false
  }
  return context
}

export  { IndexProvider, useIndex }  