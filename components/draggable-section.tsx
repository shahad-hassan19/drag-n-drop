"use client";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useState, useCallback } from "react";
import { initialComponents } from "@/lib/data";
import {
  handleCardDragEnd,
  handlePinToggle,
  handleLockToggle,
  getPinnedComponents,
} from "@/lib/actions";
import { SessionComponent } from "@/types";
import Card from "./card";
import { DropResult } from '@hello-pangea/dnd';

export default function DraggableSection() {
  const [components, setComponents] = useState<SessionComponent[]>(
    initialComponents.map((c, idx) => ({ ...c, initialIndex: idx }))
  );
  const { topPinned, bottomPinned, middle } = getPinnedComponents(components);

  const onDragEnd = useCallback(
    (result: DropResult) => handleCardDragEnd(result, components, setComponents),
    [components]
  );

  const onPinToggle = useCallback(
    (id: string) => handlePinToggle(id, components, setComponents),
    [components]
  );

  const onLockToggle = useCallback(
    (id: string) => handleLockToggle(id, setComponents),
    []
  );

  return (
    <div className="p-6 relative">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="middle" type="CARD">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {topPinned && (
                <div className="absolute top-0 left-0 right-0 z-50 bg-white">
                  <Card
                    key={topPinned.id}
                    component={topPinned}
                    index={0}
                    onPinToggle={onPinToggle}
                    onLockToggle={onLockToggle}
                  />
                </div>
              )}
              <div className={`max-w-6xl mx-auto flex flex-wrap gap-4 ${topPinned ? "my-[140px] md:my-[160px] lg:my-[140px]" : "my-0"}`}>
                {middle.map((component, index) => (
                  <Card
                    key={component.id}
                    component={component}
                    index={index}
                    onPinToggle={onPinToggle}
                    onLockToggle={onLockToggle}
                  />
                ))}
              </div>
              {bottomPinned && bottomPinned !== topPinned && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white">
                  <Card
                    key={bottomPinned.id}
                    component={bottomPinned}
                    index={components.length - 1}
                    onPinToggle={onPinToggle}
                    onLockToggle={onLockToggle}
                  />
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}