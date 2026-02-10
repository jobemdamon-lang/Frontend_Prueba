import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { AnalyticsService } from "../../helpers/analytics"

export const AnalyticsListener = () => {
    const location = useLocation()

    useEffect(() => {
        const timer = setTimeout(() => {
            const fullPath = location.pathname + location.search
            AnalyticsService.pageview(fullPath)
        }, 100)

        return () => clearTimeout(timer)
    }, [location.pathname, location.search])

    return null
}