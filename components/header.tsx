"use client";
import { Camera, Menu, Notebook, User, Video } from "lucide-react"
import { Button } from "./ui/button"
import { useEffect, useState } from "react";

function Header() {
  // Timer logic
  const [time, setTime] = useState("00:00:00");
  const [resetFlag, setResetFlag] = useState(false);
  useEffect(() => {
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const secs = String(seconds % 60).padStart(2, '0');
      setTime(`${hrs}:${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [resetFlag]);

  const handleEndSession = () => {
    setTime("00:00:00");
    setResetFlag(flag => !flag);
  };

  return (
    <div className="bg-[#106EB2] h-[60px] flex items-center justify-between text-white px-5">
        <div className="flex items-center justify-start gap-2">
            <Menu/>
            <span className="hidden md:block">Appointment&apos;s Name</span>
        </div>
        <div className="flex items-center justify-start gap-2">
            <span className="border border-white rounded-sm p-2">
              {time}
            </span>
            <Button variant="destructive" onClick={handleEndSession}>End Session</Button>
        </div>
        <div className="flex items-center justify-end gap-10">
            <div className="md:flex items-center justify-start gap-5 hidden">
                <Video/>
                <Camera/>
                <Notebook/>
            </div>
            <div className="flex items-center justify-end gap-2">
                <span className="hidden md:flex">Name</span>
                <User className="border border-white rounded-full"/>
            </div>
        </div>
    </div>
  )
}

export default Header