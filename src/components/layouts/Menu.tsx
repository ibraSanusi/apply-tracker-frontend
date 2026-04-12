import { Bot, Home, Settings, StickyNote } from "lucide-react";
import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const Pages = {
  home: "home",
  assitant: "assistant",
  applications: "applications",
  settings: "settings",
};

interface Props {
  children: ReactNode;
}

export default function Menu({ children }: Props) {
  const location = useLocation();
  const activePage = location.pathname.split("/")[1];

  return (
    <main className="">
      {children}
      <ul className="absolute bottom-4 -translate-x-1/2 transform left-1/2 flex flex-row gap-4 justify-center">
        <Link
          to={`/${Pages.home}`}
          className={`space-y-1 flex flex-col items-center px-4 py-2 ${activePage === Pages.home ? "active-page" : ""}`}
        >
          <Home size={16} />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link
          to={`/${Pages.assitant}`}
          className={`space-y-1 flex flex-col items-center px-4 py-2 ${activePage === Pages.assitant ? "active-page" : ""}`}
        >
          <Bot size={16} />
          <span className="text-[10px]">Assitant</span>
        </Link>
        <Link
          to={`/${Pages.applications}`}
          className={`space-y-1 flex flex-col items-center px-4 py-2 ${activePage === Pages.applications ? "active-page" : ""}`}
        >
          <StickyNote size={16} />
          <span className="text-[10px]">Applications</span>
        </Link>
        <Link
          to={`/${Pages.settings}`}
          className={`space-y-1 flex flex-col items-center px-4 py-2 ${activePage === Pages.settings ? "active-page" : ""}`}
        >
          <Settings size={16} />
          <span className="text-[10px]">Settings</span>
        </Link>
      </ul>
    </main>
  );
}
