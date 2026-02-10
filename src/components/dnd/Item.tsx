import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { Info, Remove } from './Actions';
//import './item.scss'
import styles from './Item.module.scss'

type ItemsType = {
    id: UniqueIdentifier;
    title: string;
    onRemove?(): void;
    actions?: boolean;
    description?: string
}

export const Item = ({ id, title, onRemove, actions, description }: ItemsType) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: id,
        data: {
            type: 'item',
        },
    });

    return (
        <li
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={
                {
                    transition,
                    transform: CSS.Translate.toString(transform),
                    "--translate-x": transform
                        ? `${Math.round(transform.x)}px`
                        : undefined,
                    "--translate-y": transform
                        ? `${Math.round(transform.y)}px`
                        : undefined,
                    "--scale-x": transform?.scaleX
                        ? `${transform.scaleX}`
                        : undefined,
                    "--scale-y": transform?.scaleY
                        ? `${transform.scaleY}`
                        : undefined

                } as React.CSSProperties
            }
            className={clsx(
                styles.Wrapper,
                isDragging && 'opacity-50',
            )}
        >
            <div className={clsx(styles.Item)}>
                <div>
                    {title}
                </div>
                {actions ? <div className={styles.Actions}>
                    {id.toString().includes('item') ? <Remove className={styles.Remove} onMouseDown={onRemove} /> : null}
                </div> :
                    null
                }
                {description ? <span className={styles.Actions}>
                    {id.toString().includes('item') ? <Info className={styles.Remove} description={description} /> : null}
                </span> :
                    null

                }
            </div>
        </li>
    );
}
