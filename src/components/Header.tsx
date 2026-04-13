import { Menu as MenuIcon, CircleUser } from "lucide-react";
import { useState } from "react";
import SidebarMenu from "./layouts/Menu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 px-6 py-4 text-primary flex justify-between items-center bg-white border-b border-slate-100">
        <div className="flex gap-3 items-center">
          <button 
            onClick={toggleMenu}
            className="p-1 -ml-1 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <MenuIcon size={24} />
          </button>
          <span className="font-extrabold text-xl tracking-tight">ApplyTracker</span>
        </div>

        <button className="p-1 rounded-full hover:bg-slate-100 transition-colors">
          <CircleUser size={28} className="text-slate-700" />
        </button>
      </header>

      <SidebarMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
}
