export interface SessionComponent {
    id: string;
    name: string;
    pinned: boolean;
    locked: boolean;
    items: string[];
    replacementOrder?: number;
    originalIndex?: number;
    initialIndex?: number;
}

export interface CardProps {
    component: SessionComponent;
    index: number;
    onPinToggle: (id: string) => void;
    onLockToggle: (id: string) => void;
}

export type DropResult = {
    source: { index: number; droppableId: string };
    destination: { index: number; droppableId: string } | null;
    type: string;
};

export interface PinControlsProps {
    pinned: boolean;
    locked: boolean;
    onPinToggle: () => void;
    onLockToggle: () => void;
}
