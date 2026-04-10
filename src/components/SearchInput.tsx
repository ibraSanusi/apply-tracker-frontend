import { Search } from "lucide-react";

export default function SearchInput() {
    return (
        <div className="shadow-2xl p-4 flex gap-3 my-5 focus-within:outline-2 focus-within:outline-red-100">
            <Search className="text-slate-700" />
            <input className="px-2 w-full outline-none" type="text" placeholder="Search roles or companies..." />
        </div>
    )
}