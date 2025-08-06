import { Camera, Menu, Notebook, User, Video } from "lucide-react"
import { Button } from "./ui/button"

function Header() {
  return (
    <div className="bg-[#106EB2] h-[60px] flex items-center justify-between text-white px-5">
        <div className="flex items-center justify-start gap-2">
            <Menu/>
            <span className="hidden md:block">Appointment&apos;s Name</span>
        </div>
        <div className="flex items-center justify-start gap-2">
            <span className="border border-white rounded-sm p-2">00:00:00</span>
            <Button variant="destructive">End Session</Button>
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