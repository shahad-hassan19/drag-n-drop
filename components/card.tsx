"use client";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import PinControls from "@/utils/pinManager";
import { CardProps } from "@/types";

export default function Card({
  component,
  index,
  onPinToggle,
  onLockToggle,
}: CardProps) {
  const isDraggable = !component.pinned;

  return (
    <Draggable
      draggableId={component.id}
      index={index}
      isDragDisabled={!isDraggable}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="rounded-sm bg-[#d6e8f5] p-4 shadow-md border border-blue-300"
        >
          <div
            className="flex justify-between items-center"
            {...provided.dragHandleProps}
          >
            <h3 className="text-md font-semibold text-blue-900">
              {component.name}
            </h3>
            <PinControls
              pinned={component.pinned}
              locked={component.locked}
              onPinToggle={() => onPinToggle(component.id)}
              onLockToggle={() => onLockToggle(component.id)}
            />
          </div>

          {/* Horizontal Droppable area for items */}
          <Droppable
            droppableId={component.id}
            direction="horizontal"
            type="ITEM"
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="mt-4 flex space-3 overflow-x-auto flex-wrap"
              >
                {component.items.map((item, idx) => (
                  <Draggable
                    key={`${component.id}-${item}`}
                    draggableId={`${component.id}-${item}`}
                    index={idx}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 bg-white border rounded min-w-[80px] text-center"
                      >
                        {item}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
