import { SessionComponent } from "@/types";
import { DropResult } from "@hello-pangea/dnd";

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

let replacementCounter = 0; // Persist this outside the function (e.g., in module scope or React state)

export const handlePinToggle = (
    id: string,
    components: SessionComponent[],
    setComponents: (updateFn: (prev: SessionComponent[]) => SessionComponent[]) => void
): void => {
    setComponents((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((c) => c.id === id);
        if (index === -1) return prev;

        const target = updated[index];

        if (target.pinned) {
            // Unpin
            updated[index] = { ...target, pinned: false, locked: false, replacementOrder: undefined };
            return updated;
        }

        const pinned = updated.filter((c) => c.pinned);
        const pinnedUnlocked = pinned.filter((c) => !c.locked);
        const pinnedLocked = pinned.filter((c) => c.locked);

        if (pinned.length < 2) {
            // Less than 2 pinned – just pin this one
            replacementCounter += 1;
            updated[index] = { ...target, pinned: true, replacementOrder: replacementCounter };
            return updated;
        }

        if (pinnedLocked.length === 2) {
            alert("Remove lock to pin card");
            return prev;
        }

        const pinIndex = updated.findIndex((c) => c.id === target.id);

        if (pinnedUnlocked.length === 2) {
            // Replace the oldest unlocked pinned card
            const sortedUnlocked = [...pinnedUnlocked].sort(
                (a, b) => (a.replacementOrder ?? 0) - (b.replacementOrder ?? 0)
            );
            const toReplace = sortedUnlocked[0];
            const replaceIndex = updated.findIndex((c) => c.id === toReplace.id);

            updated[replaceIndex] = {
                ...toReplace,
                pinned: false,
                locked: false,
                replacementOrder: undefined
            };

            replacementCounter += 1;
            updated[pinIndex] = {
                ...target,
                pinned: true,
                replacementOrder: replacementCounter
            };

            return updated;
        }

        // Only one unlocked — replace it
        const toReplace = pinnedUnlocked[0];
        const replaceIndex = updated.findIndex((c) => c.id === toReplace.id);

        updated[replaceIndex] = {
            ...toReplace,
            pinned: false,
            locked: false,
            replacementOrder: undefined
        };

        replacementCounter += 1;
        updated[pinIndex] = {
            ...target,
            pinned: true,
            replacementOrder: replacementCounter
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