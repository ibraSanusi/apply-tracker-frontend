import { Menu, CircleUser } from "lucide-react";

export default function Header() {
    return (
        <header className="px-6 py-4 text-primary flex justify-between items-center">
            <div className="flex gap-3 items-center">
                <Menu />
                <span className="font-extrabold text-lg">ApplyTracker</span>
            </div>

            <CircleUser size={30} />
        </header>
    )
}