import { FC } from "react"

type Props = {
    title: string,
    className?: string
    style?: React.CSSProperties | undefined
}

const CardHeader: FC<Props> = ({ title, className, style }) => {
    return (
        <div className={`card-header ${className}`} style={style}>
            <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder fs-3'>{title}</span>
            </h3>
        </div>
    )
}

export { CardHeader }