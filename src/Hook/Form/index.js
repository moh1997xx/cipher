import React from "react"
import {
  RecoilRoot,
  atom,
  useRecoilState,
  useSetRecoilState,
  useRecoilValue
} from "recoil"
import { config } from "../../../config"

const formValues = atom({
  key: "formValues",
  default: {}
})

const formPostType = atom({
  key: "formPostType",
  default: {}
})

function FormInit({ initialValues, postType }) {
  const setInitialValues = useSetRecoilState(formValues)
  const setPostType = useSetRecoilState(formPostType)

  React.useEffect(() => {
    setInitialValues(initialValues)
    setPostType(postType)
  }, [setInitialValues, initialValues, setPostType, postType])

  return null
}

function FormRoot({ children, initialValues, postType = "post" }) {
  return (
    <RecoilRoot>
      <FormInit initialValues={initialValues} postType={postType} />
      {children}
    </RecoilRoot>
  )
}

function useForm() {
  const [values, setValues] = useRecoilState(formValues)
  const postType = useRecoilValue(formPostType)

  const handleChange = (key, data) => {
    if (key) setValues((values) => ({ ...values, [key]: data }))
  }

  const handleSubmit = () => {
    fetch(config.baseUrl + "wp-json/wprne/v1/post/create_post", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_type: postType, values })
    })
  }

  return { values, handleChange, handleSubmit }
}

export { FormRoot, useForm }
