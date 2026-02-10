import React, { useState, ChangeEvent } from 'react';
import { IDynamicAttribute } from '../../../Types';
import { ToolTip } from '../../../../../components/tooltip/ToolTip';
import uniqid from 'uniqid';
import { warningNotification } from '../../../../../helpers/notifications';

interface TagInputProps {
    data: IDynamicAttribute[],
    label: string,
    disabled: boolean,
    className: string
}

interface IDynamicAttributeE extends IDynamicAttribute {
    UNIQID: string
}

const TagInput: React.FC<TagInputProps> = ({ data, label, disabled, className }) => {

    const [tags, setTags] = useState<IDynamicAttributeE[]>(data.map(dat => ({ ...dat, UNIQID: uniqid() })) ?? []);
    const [tagInput, setTagInput] = useState<string>('');
    const [selectedTagToUpdate, setSelectedTagToUpdate] = useState<IDynamicAttributeE>({} as IDynamicAttributeE)
    const [actionType, setActionType] = useState<'create' | 'update'>('create')

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTagInput(event.target.value);
    };

    const handleAdd = () => {
        const value = tagInput.trim();
        const tagFinded = tags.find(tag => tag.VALOR_SIMPLE?.toUpperCase() === value.toUpperCase())
        if (tagFinded) {
            warningNotification("El valor ingresado ya existe, ingrese otro.")
            return
        }
        if (value) {
            setTags((prev) => ([...tags, {
                ATRIBUTO: 'MULTIPLE',
                ESTADO: 1,
                ID_EQUIPO: data[0].ID_EQUIPO,
                ID_FAMILIA_CLASE: data[0].ID_FAMILIA_CLASE,
                ID_METADATA: data[0].ID_METADATA,
                ID_TIPO_ATRIBUTO: data[0].ID_TIPO_ATRIBUTO,
                ID_TIPO_DATO: 0,
                ID_VALOR: 0,
                ID_VALOR_LISTA: null,
                NombreAtributo: label,
                TIPO_DATO: null,
                VALOR_LISTA: null,
                VALOR_SIMPLE: value,
                UNIQID: uniqid()
            }]));
            setTagInput('');
        }
    };

    const handleEdit = (element: IDynamicAttributeE) => {
        setActionType('update')
        setTagInput(element.VALOR_SIMPLE ?? "")
        setSelectedTagToUpdate(element)
    }

    const handleChangeValue = () => {
        setTags(prev => {
            const newtags = [...prev]
            const idx = newtags.findIndex(tag => tag.VALOR_SIMPLE === selectedTagToUpdate.VALOR_SIMPLE)
            if (idx !== -1) {
                newtags[idx].VALOR_SIMPLE = tagInput
            }
            return newtags
        })
        setActionType('create')
        setTagInput('')
    }

    const handleTagRemove = (uniqid: string) => {
        const newTags = [...tags];
        const idx = newTags.findIndex(tag => tag.UNIQID === uniqid)
        newTags[idx].ESTADO = 0
        setTags(newTags)
        setTagInput("")
        setActionType('create')
    };

    return (
        <div className="tags-input">
            <label className='form-label' htmlFor={`input-${label.replace(/\s+/g, '')}`}>{label}</label>
            <div className='d-flex gap-1'>
                <input
                    disabled={disabled}
                    type="text"
                    className={`form-control ` + className}
                    placeholder="Agregar etiquetas"
                    value={tagInput}
                    id={`input-${label.replace(/\s+/g, '')}`}
                    onChange={handleInputChange}
                />
                {actionType === 'create' ?
                    <ToolTip message='Añadir' placement='right-start'>
                        <button
                            onClick={handleAdd}
                            type='button'
                            className='btn btn-transparent p-1 text-info '
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="30" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg>
                        </button>
                    </ToolTip>
                    :
                    <ToolTip message='Actualizar' placement='right-start'>
                        <button
                            onClick={handleChangeValue}
                            type='button'
                            className='btn btn-transparent p-1 text-info '
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="30" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                        </button>
                    </ToolTip>
                }
            </div>
            <section
                id={`multivalue-cmdb-${label.replace(/\s+/g, '')}`}
                data-attribute={`input-${label.replace(/\s+/g, '')}`}
                className='d-flex gap-2 overflow-scroll pt-5'
                style={{
                    maxWidth: "300px",
                    maxHeight: "100px",
                    overflowY: "hidden",
                    zIndex: 10
                }}
            >
                {tags.filter(tag => tag.ESTADO === 1).map((tag) => (
                    <div className="badge text-bg-secondary d-flex gap-2 cursor-pointer align-items-center">
                        <div className=' '
                            key={tag.UNIQID}
                            onClick={() => handleEdit(tag)}
                        >
                            <span style={{ color: "#747264" }} className='fs-7'>{tag.VALOR_SIMPLE}</span>
                        </div>
                        <span className="btn btn-sm m-0 px-2 py-0 bg-danger text-white text-bolder" onClick={() => handleTagRemove(tag.UNIQID)}>X</span>
                    </div>

                ))}
                {/*Este apartado de debajo esta oculto*/}
                {tags.map((tag) => (
                    <input
                        data-type-attribute={tag.ATRIBUTO}
                        data-id-value={tag.ID_VALOR}
                        data-id-attribute={tag.ID_METADATA}
                        data-state={tag.ESTADO}
                        type="text"
                        className='d-none'
                        name={`input-${label.replace(/\s+/g, '')}`}
                        value={tag.VALOR_SIMPLE ?? ""}
                        readOnly
                    />
                ))}
            </section>
        </div>
    );
};

export { TagInput }
