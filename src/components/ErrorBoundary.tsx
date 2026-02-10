import React from 'react'
import { Error500 } from '../views/errors/components/Error500'
import { toAbsoluteUrl } from '../helpers'

interface State {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Puedes loguear el error aquí si lo necesitas
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='d-flex flex-column flex-root'>
          <div className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'>
            <div className='d-flex flex-column flex-column-fluid text-center p-10 py-lg-20'>
              <a href='/dashboard' className='mb-10 pt-lg-20'>
                <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo.svg')} className='h-50px mb-5' />
              </a>
              <div className='pt-lg-10 mb-10'>
                <Error500 />
                <div className='text-center'>
                  <a href='/home/menu' className='btn btn-lg btn-primary fw-bolder'>
                    Ir a la página principal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}