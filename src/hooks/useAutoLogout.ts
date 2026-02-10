import { useEffect } from "react"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { RootState } from "../store/ConfigStore"
import { actionLogout } from "../store/auth/AuthSlice"

export function useAutoLogout() {
  const dispatch = useDispatch()
  const token = useSelector<RootState>(({ auth }) => (auth as any).token, shallowEqual) as string | undefined

  useEffect(() => {
    if (!token) return
    let timerId: number | undefined

    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        const payload = JSON.parse(window.atob(base64))
        const exp = Number(payload?.exp)
        if (exp && !Number.isNaN(exp)) {
          const margin = 5000 // ms de margen para clock skew
          const ms = exp * 1000 - Date.now() - margin
          console.log(`[AutoLogout] Tiempo restante para logout: ${ms} ms (${(ms/60000).toFixed(2)} min)`)
          if (ms <= 0) {
            dispatch(actionLogout())
          } else {
            timerId = window.setTimeout(() => {
              dispatch(actionLogout())
            }, ms)
          }
        }
      }
    } catch (e) {
      // token decode failed, no auto-logout timer set
    }

    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [token, dispatch])
}