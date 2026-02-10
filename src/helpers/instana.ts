declare global {
    interface Window {
        ineum?: (...args: any[]) => void
    }
}

export function identifyUserInInstana(usuario: string) {
    try {

        const userId = ''
        const userName = usuario ? usuario : ''
        const userEmail = usuario ? `${usuario}@canvia.com` : ''

        if (window.ineum && usuario) {
            // Llamar a ineum con los datos del usuario
            window.ineum('user', userId, userName, userEmail)
        } else {
            console.error('Instana no está disponible o faltan datos del usuario.')
        }
    } catch (error) {
        console.error('Error al identificar al usuario en Instana:', error)
    }
}
