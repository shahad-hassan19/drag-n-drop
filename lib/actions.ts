import { SessionComponent } from "@/types";
import { DropResult } from "@hello-pangea/dnd";

let lastTimestamp = 0;
function getUniqueTimestamp() {
    const now = Date.now();
    if (now <= lastTimestamp) {
        lastTimestamp += 1; // ensure uniqueness
        return lastTimestamp;
    } else {
        lastTimestamp = now;
        return now;
    }
}

export const handleCardDragEnd = (
    result: DropResult,
    components: SessionComponent[],
    setComponents: (updateFn: (prev: SessionComponent[]) => SessionComponent[]) => void
): void => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "CARD") {
        setComponents((prev) => {
            const middle = prev.filter((c) => !c.pinned);
            const reorderedMiddle = [...middle];
            const [moved] = reorderedMiddle.splice(source.index, 1);
            reorderedMiddle.splice(destination.index, 0, moved);

            // Reconstruct the full list: keep pinned where they are
            const newList: SessionComponent[] = [];
            for (const c of prev) {
                if (c.pinned) {
                    newList.push(c);
                } else {
                    newList.push(reorderedMiddle.shift()!);
                }
            }

            return newList;
        });
        return;
    }


    if (type === "ITEM") {
        setComponents((prev) => {
            const sourceComponent = prev.find((c) => c.id === source.droppableId);
            const destComponent = prev.find((c) => c.id === destination.droppableId);

            if (!sourceComponent || !destComponent) return prev;

            const sourceItems = [...sourceComponent.items];
            const [movedItem] = sourceItems.splice(source.index, 1);

            if (source.droppableId === destination.droppableId) {
                sourceItems.splice(destination.index, 0, movedItem);
                return prev.map((c) =>
                    c.id === sourceComponent.id
                        ? { ...c, items: sourceItems }
                        : c
                    );
            } else {
                const destItems = [...destComponent.items];
                destItems.splice(destination.index, 0, movedItem);
                return prev.map((c) => {
                    if (c.id === sourceComponent.id) return { ...c, items: sourceItems };
                    if (c.id === destComponent.id) return { ...c, items: destItems };
                    return c;
                });
            }
        });
    }
};

export const handlePinToggle = (
  id: string,
  components: SessionComponent[],
  setComponents: React.Dispatch<React.SetStateAction<SessionComponent[]>>
) => {
  setComponents((prev) => {
    const updated = prev.map(c => ({ ...c }));
    const targetIndex = updated.findIndex((c) => c.id === id);
    if (targetIndex === -1) return prev;
    const target = updated[targetIndex];

    // If already pinned → unpin it
    if (target.pinned) {
      updated.splice(targetIndex, 1);
      // Use initialIndex for original order
      const initialIndex = typeof target.initialIndex === 'number' ? target.initialIndex : updated.length;
      // Find the correct position among unpinned cards
      let insertIndex = updated.findIndex(
        (c) => !c.pinned && (typeof c.initialIndex === 'number' && c.initialIndex > initialIndex)
      );
      if (insertIndex === -1) insertIndex = updated.length;
      updated.splice(insertIndex, 0, { ...target, pinned: false, replacementOrder: undefined, originalIndex: undefined });
      return updated;
    }

    // Find all currently pinned cards
    const pinned = updated
      .map((c, idx) => ({ ...c, idx }))
      .filter(c => c.pinned)
      .sort((a, b) => (a.replacementOrder ?? 0) - (b.replacementOrder ?? 0));

    // If already 2 pinned, unpin the oldest and insert new pin at its place
    if (pinned.length >= 2) {
      const oldest = pinned[0];
      updated.splice(oldest.idx, 1);
      // Unpin it and put it back in its original position using initialIndex
      const initialIndex = typeof oldest.initialIndex === 'number' ? oldest.initialIndex : updated.length;
      let restoreIndex = updated.findIndex(
        (c) => !c.pinned && (typeof c.initialIndex === 'number' && c.initialIndex > initialIndex)
      );
      if (restoreIndex === -1) restoreIndex = updated.length;
      updated.splice(restoreIndex, 0, { ...oldest, pinned: false, replacementOrder: undefined, originalIndex: undefined });

      // Remove the new card from its current position (adjust if after oldest)
      const newTargetIndex = updated.findIndex((c) => c.id === id);
      updated.splice(newTargetIndex, 1);

      // Pin the new card and insert at the same index as the one just unpinned
      const pinnedTarget = {
        ...target,
        pinned: true,
        replacementOrder: getUniqueTimestamp(),
        originalIndex: newTargetIndex,
      };
      updated.splice(oldest.idx, 0, pinnedTarget);
      return updated;
    }

    // If less than 2 pinned, just pin at current position
    updated[targetIndex] = {
      ...updated[targetIndex],
      pinned: true,
      replacementOrder: getUniqueTimestamp(),
      originalIndex: targetIndex,
    };
    return updated;
  });
};

export const handleLockToggle = (
    id: string,
    setComponents: (updateFn: (prev: SessionComponent[]) => SessionComponent[]) => void
): void => {
    setComponents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, locked: !c.locked } : c))
    );
};

export const getPinnedComponents = (components: SessionComponent[]) => {
    const topPinned = components.find((c) => c.pinned);
    const bottomPinned = components.filter((c) => c.pinned).slice(-1)[0];
    const middle = components.filter((c) => !c.pinned);

    return { topPinned, bottomPinned, middle };
};