import { FC, ReactNode } from "react"
import '../assets/sass/components/card.scss'

interface Props extends React.HTMLAttributes<HTMLElement> {
  cardTitle: string,
  cardDetail: string,
  children: ReactNode,
  className?: string,
  bodyclassName?: string,
  bodyId?: string
}

const Card: FC<Props> = ({ cardTitle, cardDetail, children, bodyclassName, bodyId, className, ...articleProps }) => {
  return (
    <article className={`card card-dashed card-stretch shadow card-parent ${className}`} {...articleProps}>
      <header className="card-header">
        <h3 className="card-title">{cardTitle}</h3>
      </header>
      <div className={`card-body ${bodyclassName}`} id={bodyId} style={{paddingTop: '60px', paddingBottom: '10px'}}>
        {children}
      </div>
      <footer className="card-footer">
        <p>{cardDetail}</p>
      </footer>
    </article>
  )
}
export { Card }