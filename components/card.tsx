"use client";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import PinControls from "@/utils/pinManager";
import { CardProps } from "@/types";
import { useState, useEffect } from "react";

export default function Card({
  component,
  index,
  onPinToggle,
  onLockToggle,
}: CardProps) {
  const isDraggable = !component.pinned;

  // Item click counters
  const [itemCounts, setItemCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const counts: { [key: string]: number } = {};
    component.items.forEach((item) => {
      const key = `${component.id}-${item}`;
      const stored = sessionStorage.getItem(key);
      counts[key] = stored ? parseInt(stored, 10) : 0;
    });
    setItemCounts(counts);
    // eslint-disable-next-line
  }, [component.id, component.items.join(",")]);

  const handleItemClick = (item: string) => {
    const key = `${component.id}-${item}`;
    const newCount = (itemCounts[key] || 0) + 1;
    setItemCounts((prev) => ({ ...prev, [key]: newCount }));
    sessionStorage.setItem(key, newCount.toString());
  };

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
          className="rounded-sm bg-[#d6e8f5] p-4 shadow-md border border-blue-300 w-full sm:w-auto"
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
                className="mt-4 flex overflow-x-auto md:overflow-none hide-scrollbar gap-2 snap-x px-1"
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
                        className="p-2 bg-white border rounded min-w-[60vw] sm:min-w-[80px] text-center snap-center cursor-pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        {item}
                        <div className="text-xs text-gray-500 mt-1">Clicks: {itemCounts[`${component.id}-${item}`] || 0}</div>
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
