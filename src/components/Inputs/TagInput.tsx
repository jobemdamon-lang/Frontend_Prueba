import { FC } from "react"
import { IDataListFormat } from "../../helpers/Types"
import DatalistInput, { Item } from "react-datalist-input"

type Props = {
    label: string,
    value: string,
    items: IDataListFormat[],
    tags: IDataListFormat[],
    onTagAdd: (value: string) => void,
    onTagRemove: (id: string | number) => void,
    loading?: boolean,
    enableCustom?: boolean
    onAddCustom?: () => void,
    onChange?: (value: string) => void,
    className?: string
}

const TagInput: FC<Props> = (props) => {
    return (
        <div className={props.className}>
            <div className="d-flex gap-5 align-items-end mb-5">
                <div className="w-100">
                    <label htmlFor={`select-${props.label.replace(/\s+/g, '')}`} className="form-label">{props.label}</label>
                    <DatalistInput
                        className="w-100"
                        value={props.value}
                        id={`select-${props.label.replace(/\s+/g, '')}`}
                        inputProps={{
                            name: `select-${props.label.replace(/\s+/g, '')}`
                        }}
                        placeholder={props.loading ? "Cargando" : "Ingrese su busqueda"}
                        label=""
                        onSelect={(selectedItem: Item) => {
                            props.onTagAdd(selectedItem.value)
                            props.onChange && props.onChange(selectedItem.value)
                        }}
                        onChange={(event: any) => {
                            props.onChange && props.onChange(event.target.value)
                        }}
                        items={props.items}
                    />
                </div>
                {
                    props.enableCustom &&
                    <button
                        type="button"
                        onClick={() => {
                            props.onAddCustom && props.onAddCustom()
                        }}
                        className="btn btn-outline-primary border border-secondary">
                        Añadir
                    </button>
                }
            </div>

            <div className={`d-flex flex-wrap gap-5 ${props.tags.length === 0 ? 'd-none' : ''}`}>
                {props.tags.map((tag) => (
                    <Tag
                        id={tag.id}
                        value={tag.value}
                        key={tag.id}
                        onTagRemove={props.onTagRemove}
                    />

                ))}
            </div>
        </div>
    )
}

type PropsTag = {
    id: number | string,
    value: string,
    onTagRemove: (id: string | number) => void
}

const Tag: FC<PropsTag> = ({ id, value, onTagRemove }) => {
    return (
        <div
            style={{ backgroundColor: '#9CB4CC' }}
            className="badge d-flex cursor-pointer align-items-center justify-content-center p-2 px-5 shadow-sm rounded"
        >
            <div className=' '
                key={id}
            >
                <span
                    style={{ color: "white" }}
                    className='fs-6 fw-normal'>
                    {value}
                </span>
            </div>
            <span
                className="btn text-white btn-sm pe-0 ps-3 py-0 pb-1 btn-active-color-danger"
                onClick={() => onTagRemove(id)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="currentColor"
                    className="bi bi-x-lg"
                    viewBox="0 0 16 16"
                >
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
            </span>
        </div>
    )
}

export { TagInput }