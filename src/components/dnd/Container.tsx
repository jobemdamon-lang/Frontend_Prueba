import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { UniqueIdentifier } from '@dnd-kit/core';
import styles from './Container.module.scss'

interface ContainerProps {
    id: UniqueIdentifier,
    children: React.ReactNode,
    title?: string,
    description?: string
}

const Container = ({
    id,
    children,
    title,
    description
}: ContainerProps) => {

    const {
        attributes,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: id,
        data: {
            type: 'container',
        },
    })

    return (
        <div
            {...attributes}
            ref={setNodeRef}
            style={{
                transition,
                transform: CSS.Translate.toString(transform),
            }}
            className={clsx(
                styles.Container,
                isDragging && 'opacity',
            )}
        >
            <div className={styles.Header}>
                <div>
                    <span className='fs-4'>{title}</span>
                    <p className='fw-light'>{description}</p>
                </div>
                <svg viewBox="0 0 20 20" width="20">
                    <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
                </svg>
            </div>
            <ul>
                {children}
            </ul>
        </div>
    );
};

export { Container }
