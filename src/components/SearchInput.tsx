import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function SearchInput(props: SearchInputProps) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
            <Search className="text-slate-400" size={20} />
            <input 
                {...props}
                className="w-full outline-none bg-transparent text-slate-700 placeholder:text-slate-400 font-medium" 
                type="text" 
                placeholder="Search roles or companies..." 
            />
        </div>
    );
}