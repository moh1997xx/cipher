import React from 'react'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'
import { wpapi } from '../../Api'

const wpCategories = atom({
  key: 'wpCategories', 
  default: [], 
})

const isWpCategoriesLoading = atom({
  key: 'isWpCategoriesLoading', 
  default: true, 
})

const wpCategoriesStatus = atom({
  key: 'wpCategoriesStatus', 
  default: null, 
})

function useCategories(){
  const [categories, setCategories] = useRecoilState(wpCategories)
  const [isLoading, setIsLoading] = useRecoilState(isWpCategoriesLoading)
  const setStatus = useSetRecoilState(wpCategoriesStatus)

  React.useEffect(()=>{
    if(isLoading){
      wpapi.categories().then((response =>{
        setCategories(response)
        setStatus('ok')
        setIsLoading(false)
      })).catch(error => {
        setStatus(error)
        setIsLoading(false)
      })
    }
  },[isLoading, setCategories, setStatus, setIsLoading])

  return categories
}

export{ useCategories }