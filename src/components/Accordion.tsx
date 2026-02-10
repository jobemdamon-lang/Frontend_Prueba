import { FC, ReactNode } from "react"
import uniqid from "uniqid"

type PropsContainer = {
    idContainer?: number | string,
    children: ReactNode;
}

type PropsItem = {
    idItem?: number | string,
    idContainer: string | number,
    title: string,
    children: ReactNode,
    buttonClassName?: string
}


const AccordionContainer: FC<PropsContainer> = ({ idContainer, children }) => {

    const generatedID = uniqid()

    return (
        <div className="accordion" id={`kt_accordion_${idContainer ?? generatedID}`}>
            {children}
        </div>
    )
}

const AccordionItem: FC<PropsItem> = ({ children, title, idItem, idContainer, buttonClassName }) => {
    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id={`kt_accordion_1_header_${idItem}`}>
                <button className={`accordion-button ${buttonClassName}`} type="button" data-bs-toggle="collapse" data-bs-target={`#kt_accordion_1_body_${idItem}`} aria-expanded="true" aria-controls={`kt_accordion_1_body_${idItem}`}>
                    {title}
                </button>
            </h2>
            <div id={`kt_accordion_1_body_${idItem}`} className="accordion-collapse collapse show" aria-labelledby={`kt_accordion_1_header_${idItem}`} data-bs-parent={`#kt_accordion_${idContainer}`}>
                <div className="accordion-body">
                    {children}
                </div>
            </div>
        </div>
    )
}

export { AccordionContainer, AccordionItem }