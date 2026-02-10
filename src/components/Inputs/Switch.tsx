import { FC } from "react"

type SwitchInput = {
    label: string,
    onChange: (checked: boolean) => void,
    isChecked: boolean,
    id?: string,
    loading?: boolean
}

const Switch: FC<SwitchInput> = ({ label, onChange, isChecked, id, loading }) => {
    return (
        <div className="form-check form-switch">
            <input
                onChange={(e) => onChange(e.target.checked)}
                className="form-check-input"
                type="checkbox"
                checked={isChecked}
                role="switch"
                id={id}
                disabled={loading}
            />
            <label
                className="form-check-label"
                htmlFor={id}
            >
                {label}
            </label>
        </div>
    )
}
export { Switch }