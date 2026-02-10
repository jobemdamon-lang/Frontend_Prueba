const TextInput = (props:any) => {
  const pattern:string = props.pattern || null
  const classname:string = props.className || ""
  const maxLength:number = props.maxLength || 150
  const label:string = props.label
  const isrequired = props.required ? true : false
  const value:string|number = props?.value 
  const type:string = props.type || "text"
  const disabled:boolean = props.disabled || false
  const setNewValue:React.Dispatch<React.SetStateAction<string|number|null>> = props.setNewValue

    return (
    <div className='form-floating custom-input'>
      <input 
        pattern={pattern}
        required={isrequired}
        value={value}
        type={type}
        className={`form-control ${classname}`}
        maxLength={maxLength}
        onChange={(event)=>{
          setNewValue(event.target.value)
        }} 
        id={`tasks-form-${label?.replace(/\s+/g, '') }`} 
        placeholder={label} 
        disabled = {disabled}
      />
      <label className='input-text-label' htmlFor={`tasks-form-${label?.replace(/\s+/g, '') }`}>{label}</label>
    </div>
  )
}

export { TextInput }