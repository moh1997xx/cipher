import { useRecoilState, useSetRecoilState, useRecoilValue, atom } from "recoil"

const wprnePages = atom({
  key: "wprnePages",
  default: []
})

const isLoadingPages = atom({
  key: "isLoadingPages",
  default: true
})

export const useGetPages = () => {
  return useRecoilValue(wprnePages)
}

export const useSetPages = () => {
  return useSetRecoilState(wprnePages)
}

export const useIsLoadingPages = () => {
  return useRecoilState(isLoadingPages)
}
