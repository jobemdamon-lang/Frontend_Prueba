import { FC } from "react"

type Props = {
    id: number,
    value: string,
    handleRemove: (id: number) => void
}

const Tag: FC<Props> = ({ id, value, handleRemove }) => {
    return (
        <div
            style={{ backgroundColor: '#9CB4CC'}}
            className="badge d-flex cursor-pointer align-items-center justify-content-center p-2 px-5 shadow-sm rounded"
        >
            <div className=' '
                key={id}
            >
                <span
                    style={{   color: "white" }}
                    className='fs-6 fw-normal'>
                    {value}
                </span>
            </div>
            <span
                className="btn text-white btn-sm pe-0 ps-3 py-0 pb-1 btn-active-color-danger"
                onClick={() => handleRemove(id)}
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

export { Tag }