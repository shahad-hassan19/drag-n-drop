"use client";
import { Lock, Unlock, Pin, Info, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PinControlsProps } from "@/types";

export default function PinControls({
  pinned,
  locked,
  onPinToggle,
  onLockToggle,
}: PinControlsProps) {
  return (
    <div className="flex ml-2">
      <Button
        variant="ghost"
        size="icon"
      >
        <Info className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
      >
        <History className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={pinned ? "hidden" : "flex items-center justify-center"}
        title={pinned ? "Unpin" : "Pin"}
        onClick={onPinToggle}
      >
        <Pin className={`w-4 h-4 ${pinned ? "text-blue-500" : ""}`} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={pinned ? "flex items-center justify-center" : "hidden"}
        title={locked ? "Unlock" : "Lock"}
        onClick={onLockToggle}
      >
        {locked ? (
          <Lock className="w-4 h-4 text-red-500" />
        ) : (
          <Unlock className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
