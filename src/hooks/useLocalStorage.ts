import { useCallback } from "react"

const useLocalStorage = () => {

  const getUserSession = useCallback(():string => {
    const localStorageUser: any = localStorage.getItem("persist:v100-canvia-auth")
    const UserInfo = JSON.parse(localStorageUser)
    const username = JSON.parse(UserInfo?.user)
    return username?.usuario
  },[])

  return { getUserSession }
}
export { useLocalStorage }