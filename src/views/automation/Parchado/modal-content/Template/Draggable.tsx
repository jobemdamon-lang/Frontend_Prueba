import { DndContext, DragEndEvent, DragMoveEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { FC, useState } from "react";
import { Container } from "../../../../../components/dnd/Container";
import { Item } from "../../../../../components/dnd/Item";
import { DNDType } from "../../../Types";

//The id container needs to start with 'container-' and id_item with 'item-'
type Props = {
    routineContainers: DNDType[],
    setRoutineContainer: React.Dispatch<React.SetStateAction<DNDType[]>>,
    loading?: boolean
}

const Draggable: FC<Props> = ({ routineContainers, setRoutineContainer, loading }) => {

    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

    // Find the value of the items
    function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
        if (type === 'container') {
            return routineContainers.find((item) => item.id === id);
        }
        if (type === 'item') {
            return routineContainers.find((container) =>
                container.items.find((item) => item.id_item === id),
            );
        }
    }

    const findItemTitle = (id: UniqueIdentifier | undefined) => {
        const container = findValueOfItems(id, 'item');
        if (!container) return '';
        const item = container.items.find((item) => item.id_item === id);
        if (!item) return '';
        return item.name;
    };

    // DND Handlers
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    function handleDragStart(event: DragStartEvent) {

        const { active } = event;
        const { id } = active;
        setActiveId(id);
    }

    const handleDragMove = (event: DragMoveEvent) => {

        const { active, over } = event;

        // Handle Items Sorting
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('item') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active container and over container
            const activeContainer = findValueOfItems(active.id, 'item');
            const overContainer = findValueOfItems(over.id, 'item');

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return;

            // Find the index of the active and over container
            const activeContainerIndex = routineContainers.findIndex(
                (container) => container.id === activeContainer.id,
            );
            const overContainerIndex = routineContainers.findIndex(
                (container) => container.id === overContainer.id,
            );

            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id_item === active.id,
            );
            const overitemIndex = overContainer.items.findIndex(
                (item) => item.id_item === over.id,
            );
            // In the same container
            if (activeContainerIndex === overContainerIndex) {
                let newItems = [...routineContainers];
                newItems[activeContainerIndex].items = arrayMove(
                    newItems[activeContainerIndex].items,
                    activeitemIndex,
                    overitemIndex,
                );

                setRoutineContainer(newItems);
            } else {
                // In different containers
                let newItems = [...routineContainers];
                const [removeditem] = newItems[activeContainerIndex].items.splice(
                    activeitemIndex,
                    1,
                );
                newItems[overContainerIndex].items.splice(
                    overitemIndex,
                    0,
                    removeditem,
                );
                setRoutineContainer(newItems);
            }
        }

        // Handling Item Drop Into a Container
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('container') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active and over container
            const activeContainer = findValueOfItems(active.id, 'item');
            const overContainer = findValueOfItems(over.id, 'container');

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return;

            // Find the index of the active and over container
            const activeContainerIndex = routineContainers.findIndex(
                (container) => container.id === activeContainer.id,
            );
            const overContainerIndex = routineContainers.findIndex(
                (container) => container.id === overContainer.id,
            );

            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id_item === active.id,
            );

            // Remove the active item from the active container and add it to the over container
            let newItems = [...routineContainers];
            const [removeditem] = newItems[activeContainerIndex].items.splice(
                activeitemIndex,
                1,
            );
            newItems[overContainerIndex].items.push(removeditem);
            setRoutineContainer(newItems);
        }
    };

    // This is the function that handles the sorting of the containers and items when the user is done dragging.
    function handleDragEnd(event: DragEndEvent) {

        const { active, over } = event;

        // Handling item Sorting
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('item') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active and over container
            const activeContainer = findValueOfItems(active.id, 'item');
            const overContainer = findValueOfItems(over.id, 'item');

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return;
            // Find the index of the active and over container
            const activeContainerIndex = routineContainers.findIndex(
                (container) => container.id === activeContainer.id,
            );
            const overContainerIndex = routineContainers.findIndex(
                (container) => container.id === overContainer.id,
            );
            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id_item === active.id,
            );
            const overitemIndex = overContainer.items.findIndex(
                (item) => item.id_item === over.id,
            );

            // In the same container
            if (activeContainerIndex === overContainerIndex) {
                let newItems = [...routineContainers];
                newItems[activeContainerIndex].items = arrayMove(
                    newItems[activeContainerIndex].items,
                    activeitemIndex,
                    overitemIndex,
                );
                setRoutineContainer(newItems);
            } else {
                // In different containers
                let newItems = [...routineContainers];
                const [removeditem] = newItems[activeContainerIndex].items.splice(
                    activeitemIndex,
                    1,
                );
                newItems[overContainerIndex].items.splice(
                    overitemIndex,
                    0,
                    removeditem,
                );
                setRoutineContainer(newItems);
            }
        }
        // Handling item dropping into Container
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('container') &&
            active &&
            over &&
            active.id !== over.id
        ) {

            // Find the active and over container
            const activeContainer = findValueOfItems(active.id, 'item');
            const overContainer = findValueOfItems(over.id, 'container');

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return;
            // Find the index of the active and over container
            const activeContainerIndex = routineContainers.findIndex(
                (container) => container.id === activeContainer.id,
            );
            const overContainerIndex = routineContainers.findIndex(
                (container) => container.id === overContainer.id,
            );
            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id_item === active.id,
            );

            let newItems = [...routineContainers];
            const [removeditem] = newItems[activeContainerIndex].items.splice(
                activeitemIndex,
                1,
            );
            newItems[overContainerIndex].items.push(removeditem);
            setRoutineContainer(newItems);
        }
        setActiveId(null);
    }

    return (
        <div className="mt-10">
            <div className="d-flex aling-items-center justify-content-center gap-10 flex-wrap">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={routineContainers.map((i) => i.id)}>
                        {routineContainers.map((container) => (
                            <Container
                                id={container.id}
                                title={container.title}
                                key={container.id}
                                description={container.description}
                            >
                                <SortableContext items={container.items.map((i) => i.id_item)}>
                                    <div className="d-flex align-items-center gap-2 flex-column">
                                        {loading && <span className="fs-5 fw-light">Cargando..</span>}
                                        {!loading && container.items.map((i) => (
                                            <Item
                                                title={i.name} id={i.id_item}
                                                key={i.id_item}
                                                description={i.description}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </Container>
                        ))}
                    </SortableContext>
                    <DragOverlay adjustScale={false}>
                        {activeId && activeId.toString() && (
                            <Item id={activeId} title={findItemTitle(activeId)} />
                        )}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    )
}

export { Draggable }
