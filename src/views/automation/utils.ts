import { warningNotification } from "../../helpers/notifications"
import { DNDType, DNDTypeItem, IListAWXRoutines, RoutinesLinux } from "./Types"


type PropsDataDraggable = {
    titleOriginal: string,
    descriptionOriginal?: string,
    actualTitle: string,
    actualDescription?: string,
    originalData: IListAWXRoutines[],
    actualData: IListAWXRoutines[]
}
export const dataDraggable = (
    {
        titleOriginal,
        descriptionOriginal,
        actualTitle,
        actualDescription,
        originalData,
        actualData
    }: PropsDataDraggable
): DNDType[] => [
        {
            id: 'container-original-routines',
            title: titleOriginal,
            description: descriptionOriginal ?? 'Catalogo Disponible',
            items: updatedData(originalData)
        },
        {
            id: 'container-selected-routines',
            title: actualTitle,
            description: actualDescription ?? 'Rutinarias de plantilla Actual',
            items: updatedData(actualData)
        }
    ]

const updatedData = (data: IListAWXRoutines[]): DNDTypeItem[] => {
    const updatedData: DNDTypeItem[] = data.map((item: any) => ({
        id_item: `item-${item.ID_RUTINARIA.toString()}`,
        name: item.NOMBRE,
        description: item.DESCRIPCION

    }))
    return updatedData
}

export const getPercentInt = (value: string | null) => parseInt(value?.substring(0, value.length - 1) ?? '0')

export const isValidTemplate = (templateItems: DNDTypeItem[]) => {
    //Validación si existen rutinarias dentro de la plantilla
    const isEmpty = templateItems.length === 0
    if (isEmpty) {
        warningNotification('Asocie modulos a la nueva plantilla para poder crearla')
        return false
    }

    //Validación que la rutinaria de photo-pre no puede estar despues de la rutinaria photo-post
    const photoPreIndex = templateItems.findIndex(routine => routine.name === RoutinesLinux.PHOTO_PRE)
    const photoPostIndex = templateItems.findIndex(routine => routine.name === RoutinesLinux.PHOTO_POST)
    if (photoPreIndex !== -1 && photoPostIndex !== -1) {
        const isPreBeforePost = photoPreIndex > photoPostIndex
        if (isPreBeforePost) {
            warningNotification('La rutinaria Photo Pre no puede estar definida posterior a la Photo Post')
            return false
        }
    }
    return true
}
