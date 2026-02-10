import clsx from 'clsx'
import { FC, ReactNode } from 'react'

type Props = {
   className?: string
   scroll?: boolean
   height?: number
   children?: ReactNode
}

const KTCardBody: FC<Props> = (props) => {
   const { className, scroll, height, children } = props
   return (
      <div
         className={clsx(
            'card-body',
            className && className,
            {
               'card-scroll': scroll,
            },
            height && `h-${height}px`
         )}
      >
         {children}
      </div>
   )
}

export { KTCardBody }
